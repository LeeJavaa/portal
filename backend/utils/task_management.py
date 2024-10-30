from celery.result import AsyncResult

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