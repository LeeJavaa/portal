import logging
from datetime import datetime
from typing import List

import boto3
from analysis.controllers.video_processing import process_video

from botocore.exceptions import ClientError
from django.conf import settings
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.db import IntegrityError
from django.shortcuts import get_object_or_404
from ninja import NinjaAPI, Schema
from ninja.responses import Response

api = NinjaAPI()
logger = logging.getLogger('gunicorn.error')

s3_client = boto3.client('s3')

# class AnalysisOut(Schema):
#     id: int
#     created: datetime
#     last_modified: datetime
#     played_date: datetime
#     input_file: str
#     output_file: str
#     title: str
#     map: str
#     game_mode: str
#     start_time: float
#     team_one: str
#     team_two:str
#
# class AnalysisIn(Schema):
#     played_date: datetime
#     input_file: str
#     title: str
#     map: str
#     game_mode: str
#     start_time: float
#     team_one: str
#     team_two:str

class PreSignedUrlOut(Schema):
    url: str
    fields: dict

# def serialize_analysis(analysis):
#     return {
#         "id": analysis.id,
#         "created": analysis.created,
#         "last_modified": analysis.last_modified,
#         "played_date": analysis.played_date,
#         "input_file": analysis.input_file,
#         "output_file": analysis.output_file,
#         "title": analysis.title,
#         "map": analysis.map.name,
#         "game_mode": analysis.game_mode,
#         "start_time": analysis.start_time,
#         "team_one": analysis.team_one.name,
#         "team_two": analysis.team_two.name,
#     }

# @api.get("/analyses", response=List[AnalysisOut])
# def get_analyses(request):
#     try:
#         logger.info("Fetching all analyses...")
#         qs = Analysis.objects.all()
#         serialized_analyses = [serialize_analysis(analysis) for analysis in qs]
#         logger.info(f"Successfully fetched {len(serialized_analyses)} analyses")
#
#         return serialized_analyses
#     except Exception as e:
#         logger.error(f"Error fetching analyses: {e}")
#         return Response({"error": "An error occurred while fetching analyses"}, status=500)
#
# @api.get("/analysis/{analysis_id}", response=AnalysisOut)
# def get_analysis(request, analysis_id: int):
#     try:
#         logger.info(f"Fetching analysis with id {analysis_id}...")
#         analysis = get_object_or_404(Analysis, id=analysis_id)
#         serialized_analysis = serialize_analysis(analysis)
#         logger.info(f"Successfully fetched analysis with id {analysis_id}")
#         return serialized_analysis
#     except Exception as e:
#         logger.error(f"Error fetching analysis with id {analysis_id}: {e}")
#         return Response({"error": f"Error fetching analysis with id {analysis_id}"}, status=500)
#
# @api.post("/create_analysis")
# def create_analysis(request, payload: AnalysisIn):
#     try:
#         logger.info("Creating analysis...")
#         map_obj = get_object_or_404(Map, name=payload.map)
#         team_one_obj = get_object_or_404(Team, name=payload.team_one)
#         team_two_obj = get_object_or_404(Team, name=payload.team_two)
#
#         analysis_data = payload.dict(exclude={"map", "team_one", "team_two"})
#         analysis = Analysis.objects.create(
#             **analysis_data,
#             map=map_obj,
#             team_one=team_one_obj,
#             team_two=team_two_obj,
#             output_file=payload.input_file,
#         )
#
#         logger.info("Analysis created successfully")
#         return Response({"id": analysis.id}, status=201)
#     except IntegrityError as e:
#         logger.error(f"Error creating analysis: {e}")
#         return Response({"error": f"{e}: That's not good... Are you sure you entered everything correctly?"}, status=500)
#     except ValidationError as e:
#         logger.error(f"Error creating analysis: {e}")
#         return Response({"error": f"{e}: That's not good... Are you sure you entered everything correctly?"}, status=500)
#     except Exception as e:
#         logger.error(f"Error creating analysis: {e}")
#         return Response({"error": str(e)}, status=400)

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

@api.get("/generate_view_scoreboard_url/{file_name}")
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

@api.post("/process_scoreboard/{file_name}")
def process_scoreboard(request, file_name: str):
    try:
        s3_object = s3_client.get_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=file_name)
        image_content = s3_object['Body'].read()
        return {"message": "Scoreboard processing initiated", "file_name": file_name}

    except ClientError as e:
        logger.error(f"Error fetching image from S3: {e}")
        return {"error": "Failed to fetch image from S3"}, 500
    except Exception as e:
        logger.error(f"Error processing scoreboard: {e}")
        return {"error": str(e)}, 500