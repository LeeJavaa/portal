import os
import re
import sys
import time
from pathlib import Path

import cv2
import django
from celery import shared_task
from celery.utils.log import get_task_logger
from paddleocr import PaddleOCR
from utils.s3_handling import binary_to_np_array, get_object_from_bucket

# This is to run Django in a standalone configuration
project_path = Path(__file__).resolve().parent.parent
sys.path.append(str(project_path))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.conf import settings

logger = get_task_logger(__name__)

@shared_task(bind=True)
def process_scoreboard(self, scoreboard: str):
    """
    This function handles the task of performing OCR on a scoreboard screenshot and extracting the relevant data from
    it. This will also update a progress variable that will be used during SSE to display the progress update on the
    frontend.

    The data returned may look something as follows:
    {
        "game_mode": "Hardpoint",
        "map": "Karachi",
        "team_one": "OpTic Texas",
        "team_one_score": 250,
        "team_two": "New York Subliners",
        "team_two_score": 212,
        "player_stats" : {
            "Kenny" : {}
            "Dashy" : {},
            "Shotzzy" : {},
            "Pred" : {},
            "Hydra" : {},
            "Kismet" : {},
            "Skyz" : {},
            "Sib" : {}
        }
    }

    args:
        - scoreboard [Str]: The scoreboard screenshot as a string (base64 encoded image)
    returns:
        - progress [Int (0 -> 100)]: The progress of the scoreboard processing. This is a value between 0 and 100.
        - data [Dict]: A dictionary response of the extracted data. Empty until processing is complete. Example above.
    raises:
        -
    """
    try:
        game_data, player_data = get_data(scoreboard)
        print(game_data)
        print(player_data)
    except Exception as e:
        logger.error(f"Error processing scoreboard: {str(e)}")
        raise

def get_data(scoreboard: str):
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
        logger.error(f"Error processing scoreboard: {str(e)}")
        raise Exception(f"Error in get_data: {str(e)}")

if __name__ == "__main__":
    file_name = '095d3556-8d8d-4c73-a303-bf15484f5c18.png'
    scoreboard = get_object_from_bucket(file_name)
    process_scoreboard(scoreboard)