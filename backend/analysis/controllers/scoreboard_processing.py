import logging
import os
import re
import sys
import time
from dataclasses import dataclass
from enum import Enum
from typing import Dict, List, Tuple, Optional, Any
from pathlib import Path

import cv2
import django
from paddleocr import PaddleOCR
from utils.s3_handling import binary_to_np_array, get_object_from_bucket
from utils.task_management import ProgressTracker

# This is to run Django in a standalone configuration
project_path = Path(__file__).resolve().parent.parent
sys.path.append(str(project_path))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.conf import settings

logger = logging.getLogger('gunicorn.error')

class GameDataField(Enum):
    """
    Enumeration of game metadata fields and their expected regions
    """
    GAME_MODE = ((215, 47), (430, 79))
    MAP_NAME = ((215, 88), (549, 127))
    GAME_TIME = ((215, 133), (549, 167))
    TEAM1_NAME = ((190, 256), (670, 308))
    TEAM1_SCORE = ((812, 72), (892, 129))
    TEAM2_NAME = ((190, 617), (668, 665))
    TEAM2_SCORE = ((1026, 70), (1108, 127))

class PlayerDataField(Enum):
    """
    Enumeration of player data fields and their expected regions per row
    """
    NAME = ((318, 326), (659, 369))
    KD = ((683, 324), (759, 368))
    ASSISTS = ((794, 324), (870, 368))
    NON_TRADED_KILLS = ((896, 324), (972, 368))
    HIGHEST_STREAK = ((998, 324), (1074, 368))
    DAMAGE = ((1100, 324), (1198, 368))
    HILL_TIME = ((1224, 324), (1312, 368))
    AVG_HILL_TIME = ((1335, 324), (1411, 368))
    OBJ_KILLS = ((1437, 324), (1513, 368))
    CONTESTED_TIME = ((1539, 324), (1615, 368))
    KILLS_PER_HILL = ((1641, 324), (1717, 368))
    DMG_PER_HILL = ((1727, 324), (1825, 368))

@dataclass
class OCRDetection:
    """
    Data class for OCR detection results
    """
    region: List[List[float]]  # [[x1,y1], [x2,y2], [x3,y3], [x4,y4]]
    text: str
    confidence: float

@dataclass
class PlayerStats:
    """
    Data class for player statistics
    """
    name: Tuple[str, float]  # (text, confidence)
    kd: Tuple[str, float]
    assists: Tuple[str, float]
    non_traded_kills: Tuple[str, float]
    highest_streak: Tuple[str, float]
    damage: Tuple[str, float]
    hill_time: Tuple[str, float]
    avg_hill_time: Tuple[str, float]
    obj_kills: Tuple[str, float]
    contested_time: Tuple[str, float]
    kills_per_hill: Tuple[str, float]
    dmg_per_hill: Tuple[str, float]


def extract_data(scoreboard: str, progress_tracker: Optional[ProgressTracker] = None):
    try:
        ocr = PaddleOCR()
        if progress_tracker:
            progress_tracker.update(5)

        player_mask_path = os.path.join(settings.STATIC_ROOT, 'utils', 'mask_players.png')
        game_mask_path = os.path.join(settings.STATIC_ROOT, 'utils', 'mask_game.png')
        np_array_image = binary_to_np_array(scoreboard)

        if not all(os.path.exists(path) for path in [player_mask_path, game_mask_path]):
            raise FileNotFoundError("One or more required utility files are missing")

        if progress_tracker:
            progress_tracker.update(10)

        sb_full = cv2.imdecode(np_array_image, cv2.IMREAD_COLOR)
        if sb_full is None:
            raise ValueError("Failed to load the scoreboard image")

        sb = cv2.cvtColor(sb_full, cv2.COLOR_BGR2GRAY)

        if progress_tracker:
            progress_tracker.update(20)

        player_mask = cv2.imread(player_mask_path, 0)
        game_mask = cv2.imread(game_mask_path, 0)
        if player_mask is None or game_mask is None:
            raise ValueError("Failed to load mask images")

        if progress_tracker:
            progress_tracker.update(30)

        masked_players = cv2.bitwise_and(sb, sb, mask=player_mask)
        masked_game = cv2.bitwise_and(sb, sb, mask=game_mask)

        if progress_tracker:
            progress_tracker.update(40)

        players_result = ocr.ocr(masked_players)
        if progress_tracker:
            progress_tracker.update(75)

        game_result = ocr.ocr(masked_game)
        if progress_tracker:
            progress_tracker.update(100)

        if not players_result or not game_result:
            raise ValueError("OCR failed to extract data from the image")

        return game_result, players_result
    except Exception as e:
        logger.error(f"Error extracting scoreboard data: {str(e)}")
        raise Exception(f"Error in get_data: {str(e)}")

def process_data(game_data, player_data, progress_tracker: Optional[ProgressTracker] = None):
    """
    Main entry point for processing scoreboard data
    """
    try:
        # Convert raw detections to OCRDetection objects
        game_ocr = [parse_ocr_detection(d) for d in game_data[0]]
        player_ocr = [parse_ocr_detection(d) for d in player_data[0]]

        if progress_tracker:
            progress_tracker.update(20)

        # Process game metadata
        game_data = {
            field.name.lower(): find_detection_for_field(game_ocr, field.value)
            for field in GameDataField
        }

        if progress_tracker:
            progress_tracker.update(50)

        # Process player data
        players = []
        total_players = 8
        for row in range(8):
            player = process_player_row(player_ocr, row)
            if player:
                stats_dict = {
                    "name": player.name,
                    "kd": player.kd,
                    "assists": player.assists,
                    "non_traded_kills": player.non_traded_kills,
                    "highest_streak": player.highest_streak,
                    "damage": player.damage,
                    "hill_time": player.hill_time,
                    "avg_hill_time": player.avg_hill_time,
                    "obj_kills": player.obj_kills,
                    "contested_time": player.contested_time,
                    "kills_per_hill": player.kills_per_hill,
                    "dmg_per_hill": player.dmg_per_hill
                }
                players.append(stats_dict)

            if progress_tracker:
                current_player_progress = 50 + (40 * (row + 1) / total_players)
                progress_tracker.update(current_player_progress)

        if not players:
            raise ValueError("No valid player data found")

        if progress_tracker:
            progress_tracker.update(100)

        return {
            "metadata": {
                "game_mode": game_data['game_mode'],
                "map_name": game_data['map_name'],
                "game_time": game_data['game_time'],
                "team1": {
                    "name": game_data['team1_name'],
                    "score": game_data['team1_score']
                },
                "team2": {
                    "name": game_data['team2_name'],
                    "score": game_data['team2_score']
                }
            },
            "players": players
        }
    except Exception as e:
        logger.error(f"Error processing scoreboard data: {str(e)}")
        raise Exception(f"Error in process_data: {str(e)}")

def parse_ocr_detection(detection: List) -> OCRDetection:
    """
    Convert raw OCR detection to OCRDetection object
    """
    try:
        region, (text, confidence) = detection
        return OCRDetection(region, text, confidence)
    except Exception as e:
        raise ValueError(f"Failed to parse OCR detection: {str(e)}")

def get_region_center(region: List[List[float]]) -> Tuple[float, float]:
    """
    Calculate center point of detection region
    """
    try:
        x_coords = [point[0] for point in region]
        y_coords = [point[1] for point in region]
        return sum(x_coords) / 4, sum(y_coords) / 4
    except (ValueError, TypeError, IndexError) as e:
        raise ValueError(f"Invalid region format: {str(e)}")

def is_point_in_bounds(point: Tuple[float, float], bounds: Tuple[Tuple[float, float], Tuple[float, float]], tolerance: int = 10) -> bool:
    """
    Check if point falls within specified bounds with tolerance
    Added tolerance to account for slight variations in OCR detection regions
    """
    try:
        (min_x, min_y), (max_x, max_y) = bounds
        if max_x < min_x or max_y < min_y:
            raise ValueError("Invalid bounds: max values must be greater than min values")

        x, y = point
        return (min_x - tolerance <= x <= max_x + tolerance and
                min_y - tolerance <= y <= max_y + tolerance)
    except (TypeError, ValueError) as e:
        raise ValueError(f"Invalid coordinate data: {str(e)}")

def find_detection_for_field(detections: List[OCRDetection], field_bounds: Tuple[Tuple[float, float], Tuple[float, float]]) -> Optional[Tuple[str, float]]:
    """
    Find matching detection for a given field based on region bounds
    """
    try:
        for detection in detections:
            center = get_region_center(detection.region)
            if is_point_in_bounds(center, field_bounds):
                return detection.text, detection.confidence
        return None
    except Exception as e:
        raise ValueError(f"Failed to process field detection: {str(e)}")


def adjust_bounds_for_row(bounds: Tuple[Tuple[float, float], Tuple[float, float]], row: int) -> Tuple[
    Tuple[float, float], Tuple[float, float]]:
    """
    Adjust coordinate bounds for a specific row number, accounting for the team gap.
    Row 0-3 are team 1, rows 4-7 are team 2 with a larger gap between them.
    """
    try:
        NORMAL_ROW_HEIGHT = 59  # Normal distance between rows within a team
        TEAM_GAP = 120  # Gap between team 1 and team 2 (685 - 553)

        ((x1, y1), (x2, y2)) = bounds
        base_y1 = float(y1)
        base_y2 = float(y2)

        y_offset = (row * NORMAL_ROW_HEIGHT) + (TEAM_GAP if row >= 4 else 0)

        return (x1, base_y1 + y_offset), (x2, base_y2 + y_offset)
    except Exception as e:
        raise Exception(f"Failed to adjus bounds: {str(e)}")


def process_player_row(detections: List[OCRDetection], row_number: int) -> Optional[PlayerStats]:
    """Process OCR detections for a single player row"""
    # Adjust field bounds based on row position
    try:
        row_fields = {
            field: adjust_bounds_for_row(field.value, row_number)
            for field in PlayerDataField
        }

        # Find detections for each field
        fields = {
            name: find_detection_for_field(detections, adjusted_bounds)
            for name, adjusted_bounds in row_fields.items()
        }

        # Return None if no significant detections found for this row
        if not fields[PlayerDataField.NAME]:  # If no name detected, assume row is empty
            return None

        return PlayerStats(
            name=fields[PlayerDataField.NAME] or ("", 0.0),
            kd=fields[PlayerDataField.KD] or ("0", 0.0),
            assists=fields[PlayerDataField.ASSISTS] or ("0", 0.0),
            non_traded_kills=fields[PlayerDataField.NON_TRADED_KILLS] or ("0", 0.0),
            highest_streak=fields[PlayerDataField.HIGHEST_STREAK] or ("0", 0.0),
            damage=fields[PlayerDataField.DAMAGE] or ("0", 0.0),
            hill_time=fields[PlayerDataField.HILL_TIME] or ("0:00", 0.0),
            avg_hill_time=fields[PlayerDataField.AVG_HILL_TIME] or ("0:00", 0.0),
            obj_kills=fields[PlayerDataField.OBJ_KILLS] or ("0", 0.0),
            contested_time=fields[PlayerDataField.CONTESTED_TIME] or ("0:00", 0.0),
            kills_per_hill=fields[PlayerDataField.KILLS_PER_HILL] or ("0", 0.0),
            dmg_per_hill=fields[PlayerDataField.DMG_PER_HILL] or ("0", 0.0)
        )
    except Exception as e:
        raise Exception(f"Failed to process player row: {str(e)}")
