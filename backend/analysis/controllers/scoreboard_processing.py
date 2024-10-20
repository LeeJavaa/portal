import time

from celery import shared_task
from celery.utils.log import get_task_logger

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
        # Simulating processing steps
        steps = ['OCR', 'Extract game mode', 'Extract map', 'Extract teams', 'Extract scores', 'Extract player stats']
        result = {}

        for i, step in enumerate(steps):
            # Update progress
            progress = int((i + 1) / len(steps) * 100)
            self.update_state(state='PROGRESS', meta={'progress': progress})

            # Simulate processing time
            time.sleep(1)

            # Add some dummy data (replace this with actual processing logic)
            if step == 'Extract game mode':
                result['game_mode'] = 'Hardpoint'
            elif step == 'Extract map':
                result['map'] = 'Karachi'
            elif step == 'Extract teams':
                result['map'] = 'OT vs NYSL'
            elif step == 'Extract scores':
                result['map'] = '250-212'
            elif step == 'Extract player_stats':
                result['map'] = 'some stats'
            else:
               continue

        # Final result
        return {'progress': 100, 'data': result}
    except Exception as e:
        logger.error(f"Error processing scoreboard: {str(e)}")
        raise
