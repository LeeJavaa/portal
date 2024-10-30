import asyncio
import json
import logging
from datetime import datetime
from typing import Any, Dict, List, Optional

from botocore.exceptions import ClientError
from ninja import NinjaAPI, Schema
from ninja.errors import HttpError
from ninja.responses import Response

from analysis.controllers.response_generation import (
    generate_map_analyses_response,
    generate_series_analyses_response,
    generate_custom_analyses_response,
    generate_map_analysis_response,
    generate_series_analysis_response,
    generate_custom_analysis_response
)
from analysis.controllers.model_control import (
    create_custom_analysis_from_maps,
    create_custom_analysis_from_series,
    create_map_analysis,
    create_series_analysis,
    delete_custom_analyses,
    delete_custom_analysis,
    delete_map_analyses,
    delete_map_analysis,
    delete_series_analyses,
    delete_series_analysis
)
from analysis.tasks import process_scoreboard
from django.http import StreamingHttpResponse

from utils.s3_handling import generate_upload_scoreboard_url, generate_view_scoreboard_url, get_object_from_bucket
from utils.task_management import check_progress

api = NinjaAPI()
logger = logging.getLogger('gunicorn.error')

class MapAnalysisIn(Schema):
    title: str
    tournament: int
    scoreboard_file_name: str
    played_date: datetime
    game_mode: str
    map: str
    team_one: str
    team_one_score: int
    team_two: str
    team_two_score: int
    player_stats: Dict[str, Dict[str, Any]]

class SeriesAnalysisIn(Schema):
    title: str
    map_ids: List[str]

class CustomAnalysisIn(Schema):
    title: str
    map_ids: List[str] = []
    series_ids: List[str] = []

class MapAnalysesFilterIn(Schema):
    tournament: Optional[str] = None
    game_mode: Optional[str] = None
    map: Optional[str] = None
    team_one: Optional[str] = None
    team_two: Optional[str] = None
    player: Optional[str] = None

class SeriesAnalysesFilterIn(Schema):
    tournament: Optional[str] = None
    team_one: Optional[str] = None
    team_two: Optional[str] = None
    player: Optional[str] = None

class AnalysisFilterIn(Schema):
    id: str
    team: Optional[str] = None
    player: Optional[str] = None

class MapAnalysisCompressedOut(Schema):
    id: int
    played_date: str
    tournament: str
    thumbnail: str
    series: Optional[str]
    title: str
    team_one: str
    team_two: str

class SeriesAnalysisCompressedOut(Schema):
    id: int
    played_date: str
    tournament: str
    thumbnail: str
    title: str
    team_one: str
    team_two: str

class CustomAnalysesCompressedOut(Schema):
    id: int
    played_date: str
    thumbnail: str
    title: str

class MapAnalysesOut(Schema):
    map_analyses: List[MapAnalysisCompressedOut]

class SeriesAnalysesOut(Schema):
    series_analyses: List[SeriesAnalysisCompressedOut]

class CustomAnalysesOut(Schema):
    custom_analyses: List[CustomAnalysesCompressedOut]

class MapAnalysisOut(Schema):
    title: str
    played_date: str
    team_one: str
    team_two: str
    team_one_score: int
    team_two_score: int
    winner: str
    tournament: str
    series: Optional[str]
    scoreboard_file_name: str
    map: str
    game_mode: str
    player_stats: Dict[str, Dict[str, Any]]

class SeriesAnalysisOut(Schema):
    title: str
    played_date: str
    team_one: str
    team_two: str
    team_one_mc: int
    team_two_mc: int
    winner: str
    tournament: str
    maps: List[MapAnalysisCompressedOut]
    player_stats: Dict[str, Dict[str, Any]]

class CustomAnalysisOut(Schema):
    title: str
    maps: List[MapAnalysisCompressedOut]
    teams_list: List[str]
    player_stats: Dict[str, Dict[str, Any]]

class MapAnalysisIncompleteOut(Schema):
    team_one: List[str]  # [value, confidence]
    team_two: List[str]
    team_one_score: List[int]
    team_two_score: List[int]
    game_mode: List[str]
    map_name: List[str]
    player_stats: Dict[str, Dict[str, List[Any]]]

class DeleteAnalysesIn(Schema):
    ids: List[str]

class PreSignedUrlOut(Schema):
    url: str
    fields: dict

@api.get("/upload_scoreboard_url", response=PreSignedUrlOut)
def upload_scoreboard_url(request, file_name: str):
    try:
        presigned_post = generate_upload_scoreboard_url(file_name)
        return PreSignedUrlOut(url=presigned_post['url'], fields=presigned_post['fields'])
    except ClientError as e:
        logger.error(f"Error generating pre-signed URL for upload: {e}")
        return Response({"error": "Failed to generate pre-signed URL for upload"}, status=500)
    except Exception as e:
        logger.error(f"Error generating pre-signed URL for upload: {e}")
        return Response({"error": str(e)}, status=500)

@api.get("/view_scoreboard_url")
def view_scoreboard_url(request, file_name: str):
    try:
        url = generate_view_scoreboard_url(file_name)
        return {"url": url}
    except ClientError as e:
        logger.error(f"Error generating pre-signed URL for viewing: {e}")
        return Response({"error": "Failed to generate pre-signed URL for viewing"}, status=500)
    except Exception as e:
        logger.error(f"Error generating pre-signed URL for viewing: {e}")
        return Response({"error": str(e)}, status=500)

@api.get("/new_map_analysis_step_one")
def process_scoreboard_data(request, file_name: str):
    try:
        scoreboard = get_object_from_bucket(file_name)
        task = process_scoreboard.delay(scoreboard)

        return {"task_id": str(task.id)}
    except ClientError as e:
        logger.error(f"Error fetching image from S3: {e}")
        return {"error": "Failed to fetch image from S3"}, 500
    except Exception as e:
        logger.error(f"Error processing scoreboard: {e}")
        return {"error": str(e)}, 500

@api.get("/new_map_analysis_step_two")
async def process_scoreboard_progress(request, task_id: str):
    async def event_stream():
        while True:
            try:
                progress_res = check_progress(task_id)

                if progress_res.get('progress') == 100:
                    yield f"data: {json.dumps(progress_res)}\n\n"
                    break
                else:
                    yield f"data: {json.dumps({'progress': progress_res.get('progress', 0)})}\n\n"

                await asyncio.sleep(1)
            except asyncio.CancelledError:
                logger.error(f"SSE connection for task {task_id} was cancelled")
                break
            except Exception as e:
                error_message = f"Error checking progress for task {task_id}: {str(e)}"
                logger.error(error_message)
                yield f"event: error\ndata: {json.dumps({'error': error_message})}\n\n"
                break
    try:
        response = StreamingHttpResponse(
            event_stream(),
            content_type='text/event-stream'
        )
        response['Cache-Control'] = 'no-cache'
        response['X-Accel-Buffering'] = 'no'
        return response
    except Exception as e:
        logger.error(f"Failed to create StreamingHttpResponse for task {task_id}: {str(e)}")
        raise HttpError(500, "Internal server error")

@api.post("/new_map_analysis_confirmation")
def create_map_analysis_object(request, payload: MapAnalysisIn):
    try:
        map_analysis_id = create_map_analysis(payload)
        
        return {"id": map_analysis_id}
    except Exception as e:
        logger.error(f"Error creating map analysis: {e}")
        return Response({"error": str(e)}, status=500)

@api.post("/create_series_analysis")
def create_series_analysis_object(request, payload: SeriesAnalysisIn):
    try:
        valid_map_ids = [int(map_id) for map_id in payload.map_ids if map_id.isdigit()]
        response = create_series_analysis(valid_map_ids)

        return {"id": str(response.id)}
    except Exception as e:
        logger.error(f"Error creating series analysis: {e}")
        return {"error": f"Error occurred while creating series analysis: {str(e)}"}, 400

@api.post("/create_custom_analysis_from_maps")
def create_custom_analysis_object_from_maps(request, payload: CustomAnalysisIn):
    try:
        valid_map_ids = [int(map_id) for map_id in payload.map_ids if map_id.isdigit()]
        response = create_custom_analysis_from_maps(valid_map_ids)

        return {"id": str(response.id)}
    except Exception as e:
        logger.error(f"Error creating custom analysis: {e}")
        return {"error": f"Error occurred while creating custom analysis: {str(e)}"}, 400

@api.post("/create_custom_analysis_from_series")
def create_custom_analysis_object_from_series(request, payload: CustomAnalysisIn):
    try:
        valid_series_ids = [int(series_id) for series_id in payload.series_ids if series_id.isdigit()]
        response = create_custom_analysis_from_series(valid_series_ids)

        return {"id": str(response.id)}
    except Exception as e:
        logger.error(f"Error creating custom analysis: {e}")
        return {"error": f"Error occurred while creating custom analysis: {str(e)}"}, 400

@api.get("/map_analyses", response=MapAnalysesOut)
def get_map_analyses(request, payload: MapAnalysesFilterIn):
    try:
        map_analyses = generate_map_analyses_response(payload)
        result = [MapAnalysisCompressedOut(**map_analysis) for map_analysis in map_analyses]
        return {"map_analyses": result}
    except Exception as e:
        logger.error(f"Error fetching map analyses: {e}")
        return Response({"error": str(e)}, status=500)

@api.get("/series_analyses", response=SeriesAnalysesOut)
def get_series_analyses(request, payload: SeriesAnalysesFilterIn):
    try:
        series_analyses = generate_series_analyses_response(payload)
        result = [SeriesAnalysisCompressedOut(**series_analysis) for series_analysis in series_analyses]
        return {"series_analyses": result }
    except Exception as e:
        logger.error(f"Error fetching series analyses: {e}")
        return Response({"error": str(e)}, status=500)

@api.get("/custom_analyses", response=CustomAnalysesOut)
def get_custom_analyses(request):
    try:
        custom_analyses = generate_custom_analyses_response()
        result = [CustomAnalysesCompressedOut(**custom_analysis) for custom_analysis in custom_analyses]
        return {"custom_analyses": result}
    except Exception as e:
        logger.error(f"Error getting custom analyses: {e}")
        return {"error": f"Error occurred while getting custom analyses: {str(e)}"}, 400

@api.get("/map_analysis", response=MapAnalysisOut)
def get_map_analysis(request, payload: AnalysisFilterIn):
    try:
        map_analysis = generate_map_analysis_response(payload)
        return {"map_analysis": MapAnalysisOut(**map_analysis)}
    except Exception as e:
        logger.error(f"Error getting map analysis: {e}")
        raise HttpError(400, f"Error occurred while getting map analysis: {str(e)}")

@api.get("/series_analysis", response=SeriesAnalysisOut)
def get_series_analysis(request, payload: AnalysisFilterIn):
    try:
        series_analysis = generate_series_analysis_response(payload)
        return {"series_analysis": SeriesAnalysisOut(**series_analysis)}
    except Exception as e:
        logger.error(f"Error getting series analysis: {e}")
        raise HttpError(400, f"Error occurred while getting series analysis: {str(e)}")

@api.get("/custom_analysis", response=CustomAnalysisOut)
def get_custom_analysis(request, payload: AnalysisFilterIn):
    try:
        custom_analysis = generate_custom_analysis_response(payload)
        return {"custom_analysis": CustomAnalysisOut(**custom_analysis)}
    except Exception as e:
        logger.error(f"Error getting custom analysis: {e}")
        raise HttpError(400, f"Error occurred while getting custom analysis: {str(e)}")

@api.delete("/map_analyses")
def delete_map_analysis_objects(request, payload: DeleteAnalysesIn):
    try:
        valid_ids = [int(map_id) for map_id in payload.ids if map_id.isdigit()]
        response = delete_map_analyses(valid_ids)

        return {"status": str(response.status), "count": str(response.count)}
    except Exception as e:
        logger.error(f"Error deleting map analyses: {e}")
        return {"message": f"Error occurred while deleting map analyses: {str(e)}"}

@api.delete("/series_analyses")
def delete_series_analysis_objects(request, payload: DeleteAnalysesIn):
    try:
        valid_ids = [int(series_id) for series_id in payload.ids if series_id.isdigit()]
        response = delete_series_analyses(valid_ids)

        return {"status": str(response.status), "count": str(response.count)}
    except Exception as e:
        logger.error(f"Error deleting series analyses: {e}")
        return {"message": f"Error occurred while deleting series analyses: {str(e)}"}

@api.delete("/custom_analyses")
def delete_custom_analysis_objects(request, payload: DeleteAnalysesIn):
    try:
        valid_ids = [int(custom_id) for custom_id in payload.ids if custom_id.isdigit()]
        response = delete_custom_analyses(valid_ids)

        return {"status": str(response.status), "count": str(response.count)}
    except Exception as e:
        logger.error(f"Error deleting custom analyses: {e}")
        return {"message": f"Error occurred while deleting custom analyses: {str(e)}"}

@api.delete("/map_analysis")
def delete_map_analysis_object(request, map_analysis_id):
    try:
        response = delete_map_analysis(map_analysis_id)
        return {"status": str(response.status)}
    except Exception as e:
        logger.error(f"Error deleting map analysis: {e}")
        raise HttpError(400, f"Error occurred while deleting map analysis: {str(e)}")

@api.delete("/series_analysis")
def delete_series_analysis_object(request, series_analysis_id):
    try:
        response = delete_series_analysis(series_analysis_id)
        return {"status": str(response.status)}
    except Exception as e:
        logger.error(f"Error deleting series analysis: {e}")
        raise HttpError(400, f"Error occurred while deleting series analysis: {str(e)}")

@api.delete("/custom_analysis")
def delete_custom_analysis_object(request, custom_analysis_id):
    try:
        response = delete_custom_analysis(custom_analysis_id)
        return {"status": str(response.status)}
    except Exception as e:
        logger.error(f"Error deleting custom analysis: {e}")
        raise HttpError(400, f"Error occurred while deleting custom analysis: {str(e)}")
