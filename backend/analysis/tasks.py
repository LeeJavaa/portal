from celery import shared_task
from celery.utils.log import get_task_logger

from .controllers.scoreboard_processing import extract_data, process_data

logger = get_task_logger(__name__)

@shared_task(bind=True)
def process_scoreboard(self, scoreboard: str):
    """
    This function handles the task of performing OCR on a scoreboard screenshot and extracting the relevant data from
    it.

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
        - data [Dict]: A dictionary response of the extracted data. Empty until processing is complete. Example above.
    raises:
        - Exception: If there's an error during processing
    """
    try:
        game_data, player_data = extract_data(scoreboard)
        processed_data = process_data(game_data, player_data)

        return processed_data
    except Exception as e:
        logger.error(f"Error processing scoreboard: {str(e)}")
        raise