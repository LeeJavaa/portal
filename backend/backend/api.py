import asyncio
import json
import logging
from datetime import datetime
from typing import Any, Dict, List, Optional

import boto3
from analysis.controllers.response_generation import (
    generate_map_analyses_response,
    generate_series_analyses_response,
    generate_custom_analyses_response,
    generate_map_analysis_response,
    generate_series_analysis_response,
    generate_custom_analysis_response,
    generate_delete_map_analyses_response,
    generate_delete_series_analyses_response,
    generate_delete_custom_analyses_response,
    generate_delete_map_analysis_response,
    generate_delete_series_analysis_response,
    generate_delete_custom_analysis_response
)
from analysis.controllers.scoreboard_processing import (
    process_map_analysis_creation,
    process_series_analysis_creation,
    process_custom_analysis_creation_from_maps,
    process_custom_analysis_creation_from_series
)
from botocore.exceptions import ClientError
from django.conf import settings
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.db import IntegrityError
from django.http import Http404, StreamingHttpResponse
from django.shortcuts import get_object_or_404
from ninja import NinjaAPI, Schema
from ninja.errors import HttpError
from ninja.responses import Response
from utils.task_management import start_processing_task, check_progress

api = NinjaAPI()
s3_client = boto3.client('s3')
logger = logging.getLogger('gunicorn.error')

class PreSignedUrlOut(Schema):
    url: str
    fields: dict

class PreConfirmedMapAnalysisOut(Schema):
    team_one: List[str]  # [value, confidence]
    team_two: List[str]
    team_one_score: List[int]
    team_two_score: List[int]
    game_mode: List[str]
    map_name: List[str]
    player_stats: Dict[str, Dict[str, List[Any]]]

class MapAnalysisIn(Schema):
    title: str
    tournament: str
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

class CreateSeriesAnalysisOut(Schema):
    id: str

class CustomAnalysisIn(Schema):
    title: str
    map_ids: List[str] = []
    series_ids: List[str] = []

class CreateCustomAnalysisOut(Schema):
    id: str

class MapAnalysesFilter(Schema):
    tournament: Optional[str] = None
    game_mode: Optional[str] = None
    map: Optional[str] = None
    team_one: Optional[str] = None
    team_two: Optional[str] = None
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

class MapAnalysesResponse(Schema):
    map_analyses: List[MapAnalysisCompressedOut]

class SeriesAnalysesFilter(Schema):
    tournament: Optional[str] = None
    team_one: Optional[str] = None
    team_two: Optional[str] = None
    player: Optional[str] = None

class SeriesAnalysisCompressedOut(Schema):
    id: int
    played_date: str
    tournament: str
    thumbnail: str
    title: str
    team_one: str
    team_two: str

class SeriesAnalysesResponse(Schema):
    series_analyses: List[SeriesAnalysisCompressedOut]

class CustomAnalysesCompressedOut(Schema):
    id: int
    played_date: str
    thumbnail: str
    title: str

class CustomAnalysesResponse(Schema):
    custom_analyses: List[CustomAnalysesCompressedOut]

class AnalysisFilter(Schema):
    id: str
    team: Optional[str] = None
    player: Optional[str] = None

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

class DeleteAnalysesIn(Schema):
    ids: List[str]

class DeleteAnalysesOut(Schema):
    message: str

class DeleteAnalysesIn(Schema):
    id: str

class DeleteAnalysisOut(Schema):
    message: str

@api.get("/generate_upload_scoreboard_url")
def generate_upload_scoreboard_url(request, file_name: str, file_type: str):
    try:
        presigned_post = s3_client.generate_presigned_post(
            Bucket=settings.AWS_STORAGE_BUCKET_NAME,
            Key=file_name,
            ExpiresIn=3600
        )
        return PreSignedUrlOut(url=presigned_post['url'], fields=presigned_post['fields'])
    except ClientError as e:
        logger.error(f"Error generating pre-signed URL for upload: {e}")
        return Response({"error": "Failed to generate pre-signed URL for upload"}, status=500)
    except Exception as e:
        logger.error(f"Error generating pre-signed URL for upload: {e}")
        return Response({"error": str(e)}, status=500)

@api.get("/generate_view_scoreboard_url")
def generate_view_scoreboard_url(request, file_name: str):
    try:
        url = s3_client.generate_presigned_url('get_object',
            Params={
                'Bucket': settings.AWS_STORAGE_BUCKET_NAME,
                'Key': file_name
            },
            ExpiresIn=3600
        )
        return {"url": url}
    except ClientError as e:
        logger.error(f"Error generating pre-signed URL for viewing: {e}")
        return Response({"error": "Failed to generate pre-signed URL for viewing"}, status=500)
    except Exception as e:
        logger.error(f"Error generating pre-signed URL for viewing: {e}")
        return Response({"error": str(e)}, status=500)

@api.post("/process_scoreboard")
async def process_scoreboard(request, file_name: str):
    try:
        s3_object = s3_client.get_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=file_name)
        scoreboard = s3_object['Body'].read()

        task_id = await start_processing_task(scoreboard)

        return {"task_id": task_id}
    except ClientError as e:
        logger.error(f"Error fetching image from S3: {e}")
        return {"error": "Failed to fetch image from S3"}, 500
    except Exception as e:
        logger.error(f"Error processing scoreboard: {e}")
        return {"error": str(e)}, 500

@api.get("/scoreboard_progress")
async def scoreboard_progress(request, task_id: str):
    async def event_stream():
        try:
            while True:
                try:
                    progress_res = await check_progress(task_id)

                    if progress_res['progress'] == 100:
                        yield f"data: {json.dumps(PreConfirmedMapAnalysisOut(**progress_res).dict())}\n\n"
                        logger.info(f"Task {task_id} completed successfully")
                        break
                    else:
                        yield f"data: {json.dumps({'progress': progress_res['progress']})}\n\n"
                        logger.debug(f"Task {task_id} progress: {progress_res['progress']}%")

                    await asyncio.sleep(1)
                except asyncio.CancelledError:
                    logger.error(f"SSE connection for task {task_id} was cancelled")
                    break
                except Exception as e:
                    error_message = f"Error checking progress for task {task_id}: {str(e)}"
                    logger.error(error_message)
                    yield f"event: error\ndata: {json.dumps({'error': error_message})}\n\n"
                    break
        except GeneratorExit:
            logger.info(f"Client closed connection for task {task_id}")
    try:
        return StreamingHttpResponse(event_stream(), content_type='text/event-stream')
    except Exception as e:
        logger.error(f"Failed to create StreamingHttpResponse for task {task_id}: {str(e)}")
        raise HttpError(500, "Internal server error")

@api.post("/create_map_analysis")
def create_map_analysis(request, payload: MapAnalysisIn):
    try:
        map_analysis_id = process_map_analysis_creation(payload)
        
        return {"id": map_analysis_id}
    except Exception as e:
        logger.error(f"Error creating map analysis: {e}")
        return Response({"error": str(e)}, status=500)

@api.get("/map_analyses", response=MapAnalysesResponse)
def get_map_analyses(request, payload: MapAnalysesFilter):
    try:
        map_analyses = generate_map_analyses_response(payload)
        result = [MapAnalysisCompressedOut(**map_analysis) for map_analysis in map_analyses]
        return {"map_analyses": result}
    except Exception as e:
        logger.error(f"Error fetching map analyses: {e}")
        return Response({"error": str(e)}, status=500)

@api.get("/series_analyses", response=SeriesAnalysesResponse)
def get_series_analyses(request, payload: SeriesAnalysesFilter):
    try:
        series_analyses = generate_series_analyses_response(payload)
        result = [SeriesAnalysisCompressedOut(**series_analysis) for series_analysis in series_analyses]
        return {"series_analyses": result }
    except Exception as e:
        logger.error(f"Error fetching series analyses: {e}")
        return Response({"error": str(e)}, status=500)

@api.post("/create_custom_analysis_from_maps", response=CreateCustomAnalysisOut)
def create_custom_analysis_from_maps(request, payload: CustomAnalysisIn):
    try:
        valid_map_ids = [int(id) for id in payload.map_ids if id.isdigit()]
        response = process_custom_analysis_creation_from_maps(valid_map_ids)

        return {"id": str(response.id)}
    except Exception as e:
        logger.error(f"Error creating custom analysis: {e}")
        return {"error": f"Error occurred while creating custom analysis: {str(e)}"}, 400

@api.post("/create_custom_analysis_from_series", response=CreateCustomAnalysisOut)
def create_custom_analysis_from_series(request, payload: CustomAnalysisIn):
    try:
        valid_series_ids = [int(id) for id in payload.series_ids if id.isdigit()]
        response = process_custom_analysis_creation_from_series(valid_series_ids)

        return {"id": str(response.id)}
    except Exception as e:
        logger.error(f"Error creating custom analysis: {e}")
        return {"error": f"Error occurred while creating custom analysis: {str(e)}"}, 400

@api.post("/create_series_analysis", response=CreateSeriesAnalysisOut)
def create_series_analysis(request, payload: SeriesAnalysisIn):
    try:
        valid_map_ids = [int(id) for id in payload.map_ids if id.isdigit()]
        response = process_series_analysis_creation(valid_map_ids)

        return {"id": str(response.id)}
    except Exception as e:
        logger.error(f"Error creating series analysis: {e}")
        return {"error": f"Error occurred while creating series analysis: {str(e)}"}, 400

@api.get("/custom_analyses", response=CustomAnalysesResponse)
def get_custom_analyses(request):
    try:
        custom_analyses = generate_custom_analyses_response()
        result = [CustomAnalysesCompressedOut(**custom_analysis) for custom_analysis in custom_analyses]
        return {"custom_analyses": result}
    except Exception as e:
        logger.error(f"Error getting custom analyses: {e}")
        return {"error": f"Error occurred while getting custom analyses: {str(e)}"}, 400

@api.get("/map_analysis", response=MapAnalysisOut)
def get_map_analysis(request, payload: AnalysisFilter):
    try:
        map_analysis = generate_map_analysis_response(payload)
        return {"map_analysis": MapAnalysisOut(**map_analysis)}
    except Http404 as e:
        logger.error(f"Error getting map analysis: {e}")
        raise HttpError(404, "Map analysis not found")
    except Exception as e:
        logger.error(f"Error getting map analysis: {e}")
        raise HttpError(400, f"Error occurred while getting map analysis: {str(e)}")

@api.get("/series_analysis", response=SeriesAnalysisOut)
def get_series_analysis(request, payload: AnalysisFilter):
    try:
        series_analysis = generate_series_analysis_response(payload)
        return {"series_analysis": SeriesAnalysisOut(**series_analysis)}
    except Http404 as e:
        logger.error(f"Error getting series analysis: {e}")
        raise HttpError(404, "Series analysis not found")
    except Exception as e:
        logger.error(f"Error getting series analysis: {e}")
        raise HttpError(400, f"Error occurred while getting series analysis: {str(e)}")

@api.get("/custom_analysis", response=CustomAnalysisOut)
def get_custom_analysis(request, payload: AnalysisFilter):
    try:
        custom_analysis = generate_custom_analysis_response(payload)
        return {"custom_analysis": CustomAnalysisOut(**custom_analysis)}
    except Http404 as e:
        logger.error(f"Error getting custom analysis: {e}")
        raise HttpError(404, "Custom analysis not found")
    except Exception as e:
        logger.error(f"Error getting custom analysis: {e}")
        raise HttpError(400, f"Error occurred while getting custom analysis: {str(e)}")

@api.delete("/map_analyses", response=DeleteAnalysesOut)
def delete_map_analyses(request, payload: DeleteAnalysesIn):
    try:
        valid_ids = [int(id) for id in payload.id if id.isdigit()]
        response = generate_delete_map_analyses_response(valid_ids)

        return {"message": f"Deleted {response.count} map analyses"}
    except Exception as e:
        logger.error(f"Error deleting map analyses: {e}")
        return {"message": f"Error occurred while deleting map analyses: {str(e)}"}


@api.delete("/series_analyses", response=DeleteAnalysesOut)
def delete_series_analyses(request, payload: DeleteAnalysesIn):
    try:
        valid_ids = [int(id) for id in payload.id if id.isdigit()]
        response = generate_delete_series_analyses_response(valid_ids)

        return {"message": f"Deleted {response.count} series analyses"}
    except Exception as e:
        logger.error(f"Error deleting series analyses: {e}")
        return {"message": f"Error occurred while deleting series analyses: {str(e)}"}

@api.delete("/custom_analyses", response=DeleteAnalysesOut)
def delete_custom_analyses(request, payload: DeleteAnalysesIn):
    try:
        valid_ids = [int(id) for id in payload.id if id.isdigit()]
        response = generate_delete_custom_analyses_response(valid_ids)

        return {"message": f"Deleted {response.count} custom analyses"}
    except Exception as e:
        logger.error(f"Error deleting custom analyses: {e}")
        return {"message": f"Error occurred while deleting custom analyses: {str(e)}"}

@api.delete("/map_analysis", response=DeleteAnalysisOut)
def delete_map_analysis(request, payload: DeleteAnalysesIn):
    try:
        result = generate_delete_map_analysis_response(payload.id)
        return {"message": f"Deleted map analysis with ID {result.id}"}
    except Http404 as e:
        logger.error(f"Error deleting map analysis: {e}")
        raise HttpError(404, "Map analysis not found")
    except Exception as e:
        logger.error(f"Error deleting map analysis: {e}")
        raise HttpError(400, f"Error occurred while deleting map analysis: {str(e)}")

@api.delete("/series_analysis", response=DeleteAnalysisOut)
def delete_series_analysis(request, payload: DeleteAnalysesIn):
    try:
        result = generate_delete_series_analysis_response(payload.id)
        return {"message": f"Deleted series analysis with ID {result.id}"}
    except Http404 as e:
        logger.error(f"Error deleting series analysis: {e}")
        raise HttpError(404, "Map analysis not found")
    except Exception as e:
        logger.error(f"Error deleting series analysis: {e}")
        raise HttpError(400, f"Error occurred while deleting series analysis: {str(e)}")

@api.delete("/custom_analysis", response=DeleteAnalysisOut)
def delete_custom_analysis(request, payload: DeleteAnalysesIn):
    try:
        result = generate_delete_custom_analysis_response(payload.id)
        return {"message": f"Deleted custom analysis with ID {result.id}"}
    except Http404 as e:
        logger.error(f"Error deleting custom analysis: {e}")
        raise HttpError(404, "Custom analysis not found")
    except Exception as e:
        logger.error(f"Error deleting custom analysis: {e}")
        raise HttpError(400, f"Error occurred while deleting custom analysis: {str(e)}")

