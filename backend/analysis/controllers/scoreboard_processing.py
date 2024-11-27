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
    TEAM_ONE_NAME = ((190, 256), (670, 308))
    TEAM_ONE_SCORE = ((813, 124), (890, 188))
    TEAM_TWO_NAME = ((190, 617), (668, 665))
    TEAM_TWO_SCORE = ((1033, 124), (1110, 188))

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
    MODE_STAT_ONE = ((1224, 324), (1312, 368))
    MODE_STAT_TWO = ((1335, 324), (1411, 368))
    MODE_STAT_THREE = ((1437, 324), (1513, 368))
    MODE_STAT_FOUR = ((1539, 324), (1615, 368))
    MODE_STAT_FIVE = ((1641, 324), (1717, 368))
    MODE_STAT_SIX = ((1727, 324), (1825, 368))

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
    name: Tuple[str, str]  # (text, confidence)
    kd: Tuple[str, str]
    assists: Tuple[str, str]
    non_traded_kills: Tuple[str, str]
    highest_streak: Tuple[str, str]
    damage: Tuple[str, str]
    mode_stat_one: Tuple[str, str]
    mode_stat_two: Tuple[str, str]
    mode_stat_three: Tuple[str, str]
    mode_stat_four: Tuple[str, str]
    mode_stat_five: Tuple[str, str]
    mode_stat_six: Tuple[str, str]


def extract_data(scoreboard: bytes):
    try:
        ocr = PaddleOCR()

        player_mask_path = os.path.join(settings.STATIC_ROOT, 'utils', 'mask_players.png')
        game_mask_path = os.path.join(settings.STATIC_ROOT, 'utils', 'mask_game.png')
        np_array_image = binary_to_np_array(scoreboard)

        if not all(os.path.exists(path) for path in [player_mask_path, game_mask_path]):
            raise FileNotFoundError("One or more required utility files are missing")

        sb_full = cv2.imdecode(np_array_image, cv2.IMREAD_COLOR)
        if sb_full is None:
            raise ValueError("Failed to load the scoreboard image")

        sb = cv2.cvtColor(sb_full, cv2.COLOR_BGR2GRAY)

        player_mask = cv2.imread(player_mask_path, 0)
        game_mask = cv2.imread(game_mask_path, 0)
        if player_mask is None or game_mask is None:
            raise ValueError("Failed to load mask images")

        masked_players = cv2.bitwise_and(sb, sb, mask=player_mask)
        masked_game = cv2.bitwise_and(sb, sb, mask=game_mask)

        players_result = ocr.ocr(masked_players)

        game_result = ocr.ocr(masked_game)

        if not players_result or not game_result:
            raise ValueError("OCR failed to extract data from the image")

        return game_result, players_result
    except Exception as e:
        logger.error(f"Error extracting scoreboard data: {str(e)}")
        raise Exception(f"Error in get_data: {str(e)}")

def process_data(game_data, player_data):
    """
    Main entry point for processing scoreboard data
    """
    try:
        # Convert raw detections to OCRDetection objects
        game_ocr = [parse_ocr_detection(d) for d in game_data[0]]
        player_ocr = [parse_ocr_detection(d) for d in player_data[0]]

        # Process game metadata
        game_data = {
            field.name.lower(): find_detection_for_field(game_ocr, field.value)
            for field in GameDataField
        }

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
                    "mode_stat_one": player.mode_stat_one,
                    "mode_stat_two": player.mode_stat_two,
                    "mode_stat_three": player.mode_stat_three,
                    "mode_stat_four": player.mode_stat_four,
                    "mode_stat_five": player.mode_stat_five,
                    "mode_stat_six": player.mode_stat_six
                }
                players.append(stats_dict)

        if not players:
            raise ValueError("No valid player data found")

        return {
            "metadata": {
                "game_mode": game_data.get('game_mode') or ("", "low"),
                "map_name": game_data.get('map_name') or ("", "low"),
                "game_time": game_data.get('game_time') or ("0:00", "low"),
                "team_one_name": game_data.get('team_one_name') or ("", "low"),
                "team_one_score": game_data.get('team_one_score') or ("0", "low"),
                "team_two_name": game_data.get('team_two_name') or ("", "low"),
                "team_two_score": game_data.get('team_two_score') or ("0", "low"),
            },
            "player_stats": players
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

def find_detection_for_field(detections: List[OCRDetection], field_bounds: Tuple[Tuple[float, float], Tuple[float, float]]) -> Optional[Tuple[str, str]]:
    """
    Find matching detection for a given field based on region bounds
    """
    try:
        for detection in detections:
            center = get_region_center(detection.region)
            if is_point_in_bounds(center, field_bounds):
                return detection.text.lower(), convert_confidence(detection.confidence)
        return None
    except Exception as e:
        raise ValueError(f"Failed to process field detection: {str(e)}")

def convert_confidence(confidence: float) -> str:
    """
    Convert the confidence from a float value to a string representation
    (low confidence, medium confidence and high confidence)

    Args:
        confidence: Float between 0 and 1 representing OCR confidence

    Returns:
        str: 'low', 'medium', or 'high' based on configured thresholds
    """
    thresholds = getattr(settings, 'OCR_CONFIDENCE_THRESHOLDS', {
        'LOW': 0.75,
        'MEDIUM': 0.85,
        'HIGH': 1.0
    })

    if confidence < thresholds['LOW']:
        return 'low'
    elif confidence < thresholds['MEDIUM']:
        return 'medium'
    else:
        return 'high'

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
            name=fields[PlayerDataField.NAME] or ("", "low"),
            kd=fields[PlayerDataField.KD] or ("0", "low"),
            assists=fields[PlayerDataField.ASSISTS] or ("0", "low"),
            non_traded_kills=fields[PlayerDataField.NON_TRADED_KILLS] or ("0", "low"),
            highest_streak=fields[PlayerDataField.HIGHEST_STREAK] or ("0", "low"),
            damage=fields[PlayerDataField.DAMAGE] or ("0", "low"),
            mode_stat_one=fields[PlayerDataField.MODE_STAT_ONE] or ("0", "low"),
            mode_stat_two=fields[PlayerDataField.MODE_STAT_TWO] or ("0", "low"),
            mode_stat_three=fields[PlayerDataField.MODE_STAT_THREE] or ("0", "low"),
            mode_stat_four=fields[PlayerDataField.MODE_STAT_FOUR] or ("0", "low"),
            mode_stat_five=fields[PlayerDataField.MODE_STAT_FIVE] or ("0", "low"),
            mode_stat_six=fields[PlayerDataField.MODE_STAT_SIX] or ("0", "low")
        )
    except Exception as e:
        raise Exception(f"Failed to process player row: {str(e)}")
