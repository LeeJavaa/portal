from celery.result import AsyncResult

async def check_progress(task_id: str):
    result = AsyncResult(task_id)
    if result.state == 'PENDING':
        return {'progress': 0}
    elif result.state == 'SUCCESS':
        return result.result  # This should contain both progress (100) and data
    elif result.state == 'FAILURE':
        return {'progress': 100, 'error': str(result.result)}
    else:
        return result.info  # This should contain the progress