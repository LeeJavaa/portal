import logging
from datetime import datetime
from typing import  List, Optional

from botocore.exceptions import ClientError
from celery.result import AsyncResult
from ninja import NinjaAPI, Schema
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
from accounts.auth import AuthBearer
from accounts.controllers.auth import (
    handle_login,
    handle_logout,
    handle_refresh,
    handle_signup
)
from general.controllers.response_generation import generate_general_data_response

from utils.s3_handling import generate_upload_scoreboard_url, generate_view_scoreboard_url, get_object_from_bucket

api = NinjaAPI()
logger = logging.getLogger('gunicorn.error')

class PlayerStatsSchema(Schema):
    name: str
    kd: str
    assists: str
    non_traded_kills: str
    highest_streak: str
    damage: str
    mode_stat_one: str
    mode_stat_two: str
    mode_stat_three: str
    mode_stat_four: str
    mode_stat_five: str
    mode_stat_six: str

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
    player_stats: List[PlayerStatsSchema]

class SeriesAnalysisIn(Schema):
    title: str
    map_ids: List[int]

class CustomAnalysisIn(Schema):
    title: str
    map_ids: List[int] = []
    series_ids: List[int] = []

class MapAnalysesFilterIn(Schema):
    tournament: Optional[int] = None
    game_mode: Optional[str] = None
    map: Optional[str] = None
    team_one: Optional[str] = None
    team_two: Optional[str] = None
    player: Optional[str] = None

class SeriesAnalysesFilterIn(Schema):
    tournament: Optional[int] = None
    map: Optional[str] = None
    team_one: Optional[str] = None
    team_two: Optional[str] = None
    player: Optional[str] = None

class AnalysisFilterIn(Schema):
    id: int
    team: Optional[str] = None
    players: Optional[List[str]] = None

class DeleteAnalysesIn(Schema):
    ids: List[int]

class DeleteAnalysisIn(Schema):
    id: int

class PreSignedUrlOut(Schema):
    url: str
    fields: dict

# Authentication Schemas
class SignupSchema(Schema):
    email: str
    password: str
    password_confirm: str

class LoginSchema(Schema):
    email: str
    password: str

class TokenSchema(Schema):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class RefreshSchema(Schema):
    refresh_token: str

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
        return Response({"error": "Failed to fetch image from S3"}, status=500)
    except Exception as e:
        logger.error(f"Error processing scoreboard: {e}")
        return Response({"error": str(e)}, status=500)

@api.get("/new_map_analysis_step_two")
async def process_scoreboard_progress(request, task_id: str):
    try:
        task = AsyncResult(task_id)

        if task.state == 'SUCCESS':
            return {"status": "completed", "data": task.result}
        elif task.state == 'FAILURE':
            return {"status": "failed", "error": str(task.result)}
        else:
            return {"status": "processing"}
    except Exception as e:
        logger.error(f"Error checking task status: {str(e)}")
        return Response({"error": str(e)}, status=500)

@api.post("/new_map_analysis_confirmation")
def create_map_analysis_object(request, payload: MapAnalysisIn):
    try:
        map_analysis_id = create_map_analysis(payload)
        return {"id": map_analysis_id}
    except Exception as e:
        logger.error(f"Error creating map analysis: {e}")
        return Response({"error": f"Error occurred while creating map analysis: {str(e)}"}, status=500)

@api.post("/create_series_analysis")
def create_series_analysis_object(request, payload: SeriesAnalysisIn):
    try:
        response = create_series_analysis(payload.map_ids, payload.title)
        return {"id": str(response.id)}
    except Exception as e:
        logger.error(f"Error creating series analysis: {e}")
        return Response({"error": f"Error occurred while creating series analysis: {str(e)}"}, status=500)

@api.post("/create_custom_analysis_from_maps")
def create_custom_analysis_object_from_maps(request, payload: CustomAnalysisIn):
    try:
        response = create_custom_analysis_from_maps(payload.title, payload.map_ids)
        return {"id": str(response.id)}
    except Exception as e:
        logger.error(f"Error creating custom analysis: {e}")
        return Response({"error": f"Error occurred while creating custom analysis: {str(e)}"}, status=500)

@api.post("/create_custom_analysis_from_series")
def create_custom_analysis_object_from_series(request, payload: CustomAnalysisIn):
    try:
        response = create_custom_analysis_from_series(payload.title, payload.series_ids)
        return {"id": str(response.id)}
    except Exception as e:
        logger.error(f"Error creating custom analysis: {e}")
        return Response({"error": f"Error occurred while creating custom analysis: {str(e)}"}, status=500)

@api.post("/map_analyses")
def get_map_analyses(request, payload: MapAnalysesFilterIn):
    try:
        result = generate_map_analyses_response(payload)
        return {"map_analyses": result}
    except Exception as e:
        logger.error(f"Error fetching map analyses: {e}")
        return Response({"error": f"Error fetching map analyses: {str(e)}"}, status=500)

@api.post("/series_analyses")
def get_series_analyses(request, payload: SeriesAnalysesFilterIn):
    try:
        result = generate_series_analyses_response(payload)
        return {"series_analyses": result }
    except Exception as e:
        logger.error(f"Error fetching series analyses: {e}")
        return Response({"error": f"Error fetching series analyses: {str(e)}"}, status=500)

@api.post("/custom_analyses")
def get_custom_analyses(request):
    try:
        result = generate_custom_analyses_response()
        return {"custom_analyses": result}
    except Exception as e:
        logger.error(f"Error getting custom analyses: {e}")
        return Response({"error": f"Error fetching custom analyses: {str(e)}"}, status=500)

@api.post("/map_analysis")
def get_map_analysis(request, payload: AnalysisFilterIn):
    try:
        result = generate_map_analysis_response(payload)
        return {"map_analysis": result}
    except Exception as e:
        logger.error(f"Error getting map analysis: {e}")
        return Response({"error": f"Error fetching map analysis: {str(e)}"}, status=500)

@api.post("/series_analysis")
def get_series_analysis(request, payload: AnalysisFilterIn):
    try:
        result = generate_series_analysis_response(payload)
        return {"series_analysis": result}
    except Exception as e:
        logger.error(f"Error getting series analysis: {e}")
        return Response({"error": f"Error fetching series analysis: {str(e)}"}, status=500)

@api.post("/custom_analysis")
def get_custom_analysis(request, payload: AnalysisFilterIn):
    try:
        result = generate_custom_analysis_response(payload)
        return {"custom_analysis": result}
    except Exception as e:
        logger.error(f"Error getting custom analysis: {e}")
        return Response({"error": f"Error fetching custom analysis: {str(e)}"}, status=500)

@api.delete("/map_analyses")
def delete_map_analysis_objects(request, payload: DeleteAnalysesIn):
    try:
        response = delete_map_analyses(payload.ids)
        return {"status": str(response['status']), "count": str(response['count'])}
    except Exception as e:
        logger.error(f"Error deleting map analyses: {e}")
        return Response({"error": f"Error deleting map analyses: {str(e)}"}, status=500)

@api.delete("/series_analyses")
def delete_series_analysis_objects(request, payload: DeleteAnalysesIn):
    try:
        response = delete_series_analyses(payload.ids)
        return {"status": str(response['status']), "count": str(response['count'])}
    except Exception as e:
        logger.error(f"Error deleting series analyses: {e}")
        return Response({"error": f"Error deleting series analyses: {str(e)}"}, status=500)

@api.delete("/custom_analyses")
def delete_custom_analysis_objects(request, payload: DeleteAnalysesIn):
    try:
        response = delete_custom_analyses(payload.ids)
        return {"status": str(response['status']), "count": str(response['count'])}
    except Exception as e:
        logger.error(f"Error deleting custom analyses: {e}")
        return Response({"error": f"Error deleting custom analyses: {str(e)}"}, status=500)

@api.delete("/map_analysis")
def delete_map_analysis_object(request, payload: DeleteAnalysisIn):
    try:
        response = delete_map_analysis(payload.id)
        return {"status": str(response)}
    except Exception as e:
        logger.error(f"Error deleting map analysis: {e}")
        return Response({"error": f"Error deleting map analysis: {str(e)}"}, status=500)

@api.delete("/series_analysis")
def delete_series_analysis_object(request, payload: DeleteAnalysisIn):
    try:
        response = delete_series_analysis(payload.id)
        return {"status": str(response)}
    except Exception as e:
        logger.error(f"Error deleting series analysis: {e}")
        return Response({"error": f"Error deleting series analysis: {str(e)}"}, status=500)

@api.delete("/custom_analysis")
def delete_custom_analysis_object(request, payload: DeleteAnalysisIn):
    try:
        response = delete_custom_analysis(payload.id)
        return {"status": str(response)}
    except Exception as e:
        logger.error(f"Error deleting custom analysis: {e}")
        return Response({"error": f"Error deleting custom analysis: {str(e)}"}, status=500)

@api.get("/general_data")
def general_data(request):
    try:
        response = generate_general_data_response()
        return {"general_data": response}
    except Exception as e:
        logger.error(f"Error getting general data: {e}")
        return Response({"error": f"Error getting general data: {str(e)}"}, status=500)

# Authentication endpoints
@api.post("/auth/signup", response={201: TokenSchema})
def signup(request, payload: SignupSchema):
    try:
        response = handle_signup(payload)
        return 201, response
    except Exception as e:
        logger.error(f"Error signing up: {e}")
        return Response({"error": f"Error signing up: {str(e)}"}, status=401)

@api.post("/auth/login", response={200: TokenSchema})
def login(request, payload: LoginSchema):
    try:
        response = handle_login(payload)
        return 200, response
    except Exception as e:
        logger.error(f"Error logging in: {e}")
        return Response({"error": f"Error logging in: {str(e)}"}, status=401)

@api.post("/auth/refresh", response={200: TokenSchema})
def refresh_token(request, payload:RefreshSchema):
    try:
        response = handle_refresh(payload)
        return 200, response
    except Exception as e:
        logger.error(f"Error refreshing token: {e}")
        return Response({"error": f"Error refreshing token: {str(e)}"}, status=401)

@api.post("/auth/logout", auth=AuthBearer())
def logout(request):
    try:
        response = handle_logout(request)
        return 200, response
    except Exception as e:
        logger.error(f"Error logging out: {e}")
        return Response({"error": f"Error logging out: {str(e)}"}, status=401)