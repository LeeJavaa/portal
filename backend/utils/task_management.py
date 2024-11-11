from typing import Any, Dict, Optional, Union

from celery.exceptions import CeleryError
from celery.result import AsyncResult

class ProgressTracker:
    """
    Tracks progress of Celery tasks within a specified range.

    Attributes:
        - celery_task: The Celery task being tracked
        - start_progress: Starting progress value (default: 0)
        - end_progress: Ending progress value (default: 100)
        - current_progress: Current progress value
    """

    def __init__(self, celery_task, start_progress: int = 0, end_progress: int = 100):
        """
        Initialize the progress tracker.

        Args:
            - celery_task: Celery task to track
            - start_progress: Starting progress value
            - end_progress: Ending progress value
        """
        self.celery_task = celery_task
        self.start_progress = start_progress
        self.end_progress = end_progress
        self.current_progress = start_progress

    def update(self, percentage: Union[int, float], data: Optional[Dict[str, Any]] = None) -> None:
        """
        Update progress within the allocated range.

        Args:
            - percentage: Progress percentage (0-100)
            - data: Optional dictionary with additional progress data

        Raises:
            Exception: If a celery error or an unexpected error occurs
        """
        try:
            self.current_progress = self.start_progress + (percentage * (self.end_progress - self.start_progress) / 100)
            self.celery_task.update_state(
                state='PROGRESS',
                meta={
                    'progress': int(self.current_progress),
                    'data': data or {}
                }
            )
        except CeleryError as e:
            raise Exception(f"Failed to update task state: {str(e)}")
        except Exception as e:
            raise Exception(f"Unexpected error updating task state: {str(e)}")

def check_progress(task_id: str):
    """
    Helper function to check Celery task progress.

    Args:
        - task_id: ID of the Celery task to check

    Returns:
        - Dictionary containing progress information

    Raises:
        - ValueError: If task_id is invalid
        - CeleryError: If there's an error retrieving task status
    """
    try:
        task = AsyncResult(task_id)

        if task.state == 'PENDING':
            return {'progress': 0, 'data': {}}
        elif task.state == 'SUCCESS':
            return task.result
        elif task.state == 'FAILURE':
            return {'progress': 0, 'data': {}, 'error': str(task.result)}
        elif task.state == 'PROGRESS':
            return task.info
        else:
            return {'progress': task.state, 'data': {}, 'error': "task state does not exist"}
    except CeleryError as e:
        raise
    except Exception as e:
        raise ValueError(f"Unexpected error retrieving task status: {str(e)}")