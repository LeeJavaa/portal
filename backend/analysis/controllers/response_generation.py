from datetime import datetime
from typing import List, Dict

import logging
from analysis.models import MapAnalysis, CustomAnalysis, SeriesAnalysis
from django.core.exceptions import ValidationError
from django.db.models import Prefetch, Q
from general.models import Tournament

logger = logging.getLogger('gunicorn.error')

def generate_map_analyses_response(filter_payload) -> List[Dict]:
    """
    This takes in all the filter data and generates an appropriate response containing all the filtered map analyses
    objects.

    args:
        - filter_payload [ninja.Schema]: A payload object containing the filter data (tournament, game mode, map, team
        one, team two, player)
    returns:
        - map_analyses [List[Dict]]: A list of map analysis objects in dictionary form, only containing necessary data
        for compressed form.
    raises:
        - ValidationError: If there's an issue with data validation
        - Exception: For any other unexpected errors during processing
    """
    try:
        map_analyses_query = MapAnalysis.objects.select_related(
            'team_one',
            'team_two',
            'winner',
            'map',
            'game_mode',
            'tournament'
        )

        if filter_payload.tournament:
            map_analyses_query = map_analyses_query.filter(tournament_id=filter_payload.tournament)

        if filter_payload.game_mode:
            map_analyses_query = map_analyses_query.filter(game_mode__code=filter_payload.game_mode)

        if filter_payload.map:
            map_analyses_query = map_analyses_query.filter(map__name=filter_payload.map)

        if filter_payload.team_one:
            team_one_query = Q(team_one__code=filter_payload.team_one) | Q(team_two__code=filter_payload.team_one)
            map_analyses_query = map_analyses_query.filter(team_one_query)

        if filter_payload.team_two:
            team_two_query = Q(team_one__code=filter_payload.team_two) | Q(team_two__code=filter_payload.team_two)
            map_analyses_query = map_analyses_query.filter(team_two_query)

        if filter_payload.player:
            map_analyses_query = map_analyses_query.filter(
                playermapperformance__player__gamertag_clean=filter_payload.player
            ).distinct()

        map_analyses_query = map_analyses_query.order_by('-played_date')

        tournament_map_dict = {}

        for map_analysis in map_analyses_query:
            tournament_id = map_analysis.tournament_id

            if tournament_id not in tournament_map_dict:
                tournament_map_dict[tournament_id] = {
                    "tournamentTitle": map_analysis.tournament.title,
                    "maps": [],
                    "played_date": map_analysis.tournament.played_date
                }

            map_data = {
                "id": map_analysis.id,
                "title": map_analysis.title,
                "thumbnail": map_analysis.thumbnail,
                "teamOne": map_analysis.team_one.name,
                "teamTwo": map_analysis.team_two.name,
                "winner": map_analysis.winner.name,
                "playedDate": map_analysis.played_date.isoformat(),
                "map": map_analysis.map.name,
                "gameMode": map_analysis.game_mode.name
            }

            tournament_map_dict[tournament_id]["maps"].append(map_data)

        response = [
            {
                "tournamentTitle": data["tournamentTitle"],
                "maps": data["maps"]
            }
            for tournament_id, data in sorted(
                tournament_map_dict.items(),
                key=lambda x: x[1]["played_date"],
                reverse=True
            )
        ]

        return response
    except ValidationError as ve:
        logger.error(f"Validation error in generate_map_analyses_response: {ve}")
        raise ValidationError(f"Invalid data: {str(ve)}")

    except Exception as e:
        logger.error(f"Unexpected error in generate_map_analyses_response: {e}")
        raise Exception(f"Error processing map analyses: {str(e)}")

def generate_series_analyses_response(filter_payload):
    """
    This takes in all the filter data and generates an appropriate response containing all the filtered series analyses
    objects.

    args:
        - filter_payload [ninja.Schema]: A payload object containing the filter data (tournament, team one, team two,
        player)
    returns:
        - series_analyses [List[Dict]]: A list of series analysis objects in dictionary form, only containing necessary
        data for compressed form.
    raises:
        - ValidationError: If there's an issue with data validation
        - Exception: For any other unexpected errors during processing
    """
    try:
        series_analyses_query = SeriesAnalysis.objects.select_related(
            'team_one',
            'team_two',
            'winner',
            'tournament'
        )

        if filter_payload.tournament:
            series_analyses_query = series_analyses_query.filter(tournament_id=filter_payload.tournament)

        if filter_payload.team_one:
            team_one_query = Q(team_one__code=filter_payload.team_one) | Q(team_two__code=filter_payload.team_one)
            series_analyses_query = series_analyses_query.filter(team_one_query)

        if filter_payload.team_two:
            team_two_query = Q(team_one__code=filter_payload.team_two) | Q(team_two__code=filter_payload.team_two)
            series_analyses_query = series_analyses_query.filter(team_two_query)

        if filter_payload.player:
            series_analyses_query = series_analyses_query.filter(
                playerseriesperformance__player__gamertag_clean=filter_payload.player
            ).distinct()

        series_analyses_query = series_analyses_query.order_by('-played_date')

        tournament_map_dict = {}

        for series_analysis in series_analyses_query:
            tournament_id = series_analysis.tournament_id

            if tournament_id not in tournament_map_dict:
                tournament_map_dict[tournament_id] = {
                    "tournamentTitle": series_analysis.tournament.title,
                    "series": [],
                    "played_date": series_analysis.tournament.played_date
                }

            series_data = {
                "id": series_analysis.id,
                "title": series_analysis.title,
                "thumbnail": series_analysis.thumbnail,
                "teamOne": series_analysis.team_one.name,
                "teamTwo": series_analysis.team_two.name,
                "winner": series_analysis.winner.name,
                "playedDate": series_analysis.played_date.isoformat(),
            }

            tournament_map_dict[tournament_id]["series"].append(series_data)

        response = [
            {
                "tournamentTitle": data["tournamentTitle"],
                "series": data["series"]
            }
            for tournament_id, data in sorted(
                tournament_map_dict.items(),
                key=lambda x: x[1]["played_date"],
                reverse=True
            )
        ]

        return response
    except ValidationError as ve:
        logger.error(f"Validation error in generate_series_analyses_response: {ve}")
        raise ValidationError(f"Invalid data: {str(ve)}")

    except Exception as e:
        logger.error(f"Unexpected error in generate_series_analyses_response: {e}")
        raise Exception(f"Error processing map analyses: {str(e)}")

def generate_custom_analyses_response():
    """
    This simply fetches all the custom analysis objects and returns it in descending order (ordered by creation). Only
    containing necessary data for compressed form.

    args:
        - None
    returns:
        - series_analyses [List[Dict]]: A list of series analysis objects in dictionary form
    raises:
        - ValidationError: If there's an issue with data validation
        - Exception: For any other unexpected errors during processing
    """
    try:
        custom_analyses = CustomAnalysis.objects.order_by('-created').values(
            'created',
            'title',
            'thumbnail'
        )

        result = [
            {
                "created": custom_analysis["created"].isoformat(),
                "title": custom_analysis["title"],
                "thumbnail": custom_analysis["thumbnail"]
            }
            for custom_analysis in custom_analyses
        ]

        return result
    except ValidationError as ve:
        logger.error(f"Validation error in generate_custom_analyses_response: {ve}")
        raise ValidationError(f"Invalid data: {str(ve)}")
    except Exception as e:
        logger.error(f"Unexpected error in generate_custom_analyses_response: {e}")
        raise Exception(f"Error processing custom analyses: {str(e)}")

def generate_map_analysis_response(filter_payload):
    """
    This returns the data for a single map analysis according to the filters applied in the payload.

    args:
        - filter_payload [ninja.Schema]: A payload object containing the map analysis id and filter data (team, player)
    returns:
        - map_analysis [Dict]: A single map analysis object
    raises:
        -
    """
    pass

def generate_series_analysis_response(filter_payload):
    """
    This returns the data for a single series analysis according to the filters applied in the payload.

    args:
        - filter_payload [ninja.Schema]: A payload object containing the series analysis id and filter data (team,
        player)
    returns:
        - series_analysis [Dict]: A single series analysis object
    raises:
        -
    """
    pass

def generate_custom_analysis_response(filter_payload):
    """
    This returns the data for a single custom analysis according to the filters applied in the payload.

    args:
        - filter_payload [ninja.Schema]: A payload object containing the custom analysis id and filter data (team,
        player)
    returns:
        - custom_analysis [Dict]: A single custom analysis object
    raises:
        -
    """
    pass
