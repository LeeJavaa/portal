from datetime import datetime

from django.shortcuts import get_object_or_404

from analysis.controllers.video_processing import process_video
from analysis.models import Analysis, Map, Team

from ninja import NinjaAPI, Schema
from ninja.responses import Response

api = NinjaAPI()

class AnalysisOut(Schema):
    id: int
    created: datetime
    last_modified: datetime
    played_date: datetime
    input_file: str
    output_file: str
    title: str
    map: str
    game_mode: str
    start_time: float
    team_one: str
    team_two:str

class AnalysisIn(Schema):
    played_date: datetime
    input_file: str
    title: str
    map: str
    game_mode: str
    start_time: float
    team_one: str
    team_two:str

# @api.get("/analyses")

@api.get("/analysis/{analysis_id}", response=AnalysisOut)
def get_analysis(request, analysis_id: int):
    analysis = get_object_or_404(Analysis, id=analysis_id)
    
    return {
        "id": analysis.id,
        "created": analysis.created,
        "last_modified": analysis.last_modified,
        "played_date": analysis.played_date,
        "input_file": analysis.input_file,
        "output_file": analysis.output_file,
        "title": analysis.title,
        "map": analysis.map.name,
        "game_mode": analysis.game_mode,
        "start_time": analysis.start_time,
        "team_one": analysis.team_one.name,
        "team_two": analysis.team_two.name,
    }

@api.post("/create_analysis")
def create_analysis(request, payload: AnalysisIn):
    try:
        map_obj = get_object_or_404(Map, name=payload.map)
        team_one_obj = get_object_or_404(Team, name=payload.team_one)
        team_two_obj = get_object_or_404(Team, name=payload.team_two)

        analysis_data = payload.dict(exclude={"map", "team_one", "team_two"})
        analysis = Analysis.objects.create(
            **analysis_data,
            map=map_obj,
            team_one=team_one_obj,
            team_two=team_two_obj,
            output_file=payload.input_file,
        )

        processing_result = process_video(analysis)

        if processing_result:
            return Response({"id": analysis.id}, status=201)
        else:
            analysis.delete()
            return Response({"error": "Video processing failed"}, status=500)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

