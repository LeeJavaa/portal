from celery.result import AsyncResult

class ProgressTracker:
    def __init__(self, celery_task, start_progress=0, end_progress=100):
        self.celery_task = celery_task
        self.start_progress = start_progress
        self.end_progress = end_progress
        self.current_progress = start_progress

    def update(self, percentage, data=None):
        """Update progress within the allocated range"""
        self.current_progress = self.start_progress + (percentage * (self.end_progress - self.start_progress) / 100)
        self.celery_task.update_state(
            state='PROGRESS',
            meta={
                'progress': int(self.current_progress),
                'data': data or {}
            }
        )

def check_progress(task_id: str):
    """Helper function to check Celery task progress"""
    task = AsyncResult(task_id)

    if task.state == 'PENDING':
        return {'progress': 0, 'data': {}}
    elif task.state == 'SUCCESS':
        return task.result
    elif task.state == 'FAILURE':
        return {'progress': 0, 'data': {}, 'error': str(task.result)}
    elif task.state == 'PROGRESS':
        return task.info