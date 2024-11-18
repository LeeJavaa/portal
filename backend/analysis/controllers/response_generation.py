from datetime import datetime
from typing import List, Dict

import logging
from analysis.models import (
    MapAnalysis,
    CustomAnalysis,
    PlayerCustomAnalysisPerformance,
    PlayerMapPerformance,
    PlayerMapPerformanceControl,
    PlayerMapPerformanceHP,
    PlayerMapPerformanceSND,
    PlayerSeriesPerformance,
    SeriesAnalysis
)
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.db.models import Prefetch, Q
from utils.analysis_handling import parse_seconds_to_time

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
                    "tournament_title": map_analysis.tournament.title,
                    "maps": [],
                    "played_date": map_analysis.tournament.played_date
                }

            map_data = {
                "id": map_analysis.id,
                "title": map_analysis.title,
                "thumbnail": map_analysis.thumbnail,
                "team_one": map_analysis.team_one.name,
                "team_two": map_analysis.team_two.name,
                "winner": map_analysis.winner.name,
                "played_date": map_analysis.played_date.isoformat(),
                "map": map_analysis.map.name,
                "game_mode": map_analysis.game_mode.name
            }

            tournament_map_dict[tournament_id]["maps"].append(map_data)

        response = [
            {
                "tournament_title": data["tournament_title"],
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
                    "tournament_title": series_analysis.tournament.title,
                    "series": [],
                    "played_date": series_analysis.tournament.played_date
                }

            series_data = {
                "id": series_analysis.id,
                "title": series_analysis.title,
                "thumbnail": series_analysis.thumbnail,
                "team_one": series_analysis.team_one.name,
                "team_two": series_analysis.team_two.name,
                "winner": series_analysis.winner.name,
                "played_date": series_analysis.played_date.isoformat(),
            }

            tournament_map_dict[tournament_id]["series"].append(series_data)

        response = [
            {
                "tournament_title": data["tournament_title"],
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
    try:
        try:
            map_analysis = MapAnalysis.objects.get(id=filter_payload.id)
        except ObjectDoesNotExist:
            raise

        all_performances = PlayerMapPerformance.objects.filter(
            map_analysis=map_analysis
        ).select_related(
            'player',
            'player__team',
            'playermapperformancehp',
            'playermapperformancesnd',
            'playermapperformancecontrol'
        )

        filtered_performances = all_performances
        if filter_payload.team:
            filtered_performances = filtered_performances.filter(player__team__code=filter_payload.team)
        if filter_payload.players:
            filtered_performances = filtered_performances.filter(player__gamertag_clean__in=filter_payload.players)

        all_sorted_performances = process_performances(map_analysis, all_performances)
        player_performance_data = {}
        for performance in all_sorted_performances:
            player_performance_data[performance.player.gamertag_clean] = create_map_performance_dict(map_analysis, performance)

        response = {
            "id": map_analysis.id,
            "created": map_analysis.created,
            "last_modified": map_analysis.last_modified,
            "tournament": map_analysis.tournament.id,
            "series_analysis": map_analysis.series_analysis.id if map_analysis.series_analysis else None,
            "title": map_analysis.title,
            "thumbnail": map_analysis.thumbnail,
            "screenshot": map_analysis.screenshot,
            "team_one": map_analysis.team_one.name,
            "team_two": map_analysis.team_two.name,
            "team_one_score": map_analysis.team_one_score,
            "team_two_score": map_analysis.team_two_score,
            "winner": map_analysis.winner.name,
            "played_date": map_analysis.played_date,
            "map": map_analysis.map.name,
            "game_mode": map_analysis.game_mode.name,
            "player_performance_data": player_performance_data
        }

        if filter_payload.team or filter_payload.players:
            filtered_sorted_performances = process_performances(map_analysis, filtered_performances)
            filtered_player_performance_data = {}
            for performance in filtered_sorted_performances:
                filtered_player_performance_data[performance.player.gamertag_clean] = create_map_performance_dict(
                    map_analysis, performance)
            response["filtered_player_performance_data"] = filtered_player_performance_data

        return response
    except ValidationError as ve:
        logger.error(f"Validation error in generate_map_analysis_response: {ve}")
        raise ValidationError(f"Invalid data: {str(ve)}")
    except Exception as e:
        logger.error(f"Unexpected error in generate_map_analysis_response: {e}")
        raise Exception(f"Error processing map analysis: {str(e)}")

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
    try:
        try:
            series_analysis = SeriesAnalysis.objects.get(id=filter_payload.id)
        except ObjectDoesNotExist:
            raise

        all_performances = PlayerSeriesPerformance.objects.filter(
            series_analysis=series_analysis
        ).select_related(
            'player',
            'player__team'
        )

        filtered_performances = all_performances
        if filter_payload.team:
            filtered_performances = filtered_performances.filter(player__team__code=filter_payload.team)
        if filter_payload.players:
            filtered_performances = filtered_performances.filter(player__gamertag_clean__in=filter_payload.players)

        all_sorted_performances = process_performances(series_analysis, all_performances)
        player_performance_data = {}
        for performance in all_sorted_performances:
            player_performance_data[performance.player.gamertag_clean] = create_general_performance_dict(performance)

        response = {
            "id": series_analysis.id,
            "created": series_analysis.created,
            "last_modified": series_analysis.last_modified,
            "tournament": series_analysis.tournament.id,
            "title": series_analysis.title,
            "thumbnail": series_analysis.thumbnail,
            "winner": series_analysis.winner.name,
            "played_date": series_analysis.played_date,
            "team_one": series_analysis.team_one.name,
            "team_two": series_analysis.team_two.name,
            "team_one_map_count": series_analysis.team_one_map_count,
            "team_two_map_count": series_analysis.team_two_map_count,
            "player_performance_data": player_performance_data
        }

        if filter_payload.team or filter_payload.players:
            filtered_sorted_performances = process_performances(series_analysis, filtered_performances)
            filtered_player_performance_data = {}
            for performance in filtered_sorted_performances:
                filtered_player_performance_data[performance.player.gamertag_clean] = create_general_performance_dict(
                    series_analysis, performance
                )
            response["filtered_player_performance_data"] = filtered_player_performance_data

        return response
    except ValidationError as ve:
        logger.error(f"Validation error in generate_series_analysis_response: {ve}")
        raise ValidationError(f"Invalid data: {str(ve)}")
    except Exception as e:
        logger.error(f"Unexpected error in generate_series_analysis_response: {e}")
        raise Exception(f"Error processing series analysis: {str(e)}")

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
    try:
        try:
            custom_analysis = CustomAnalysis.objects.get(id=filter_payload.id)
        except ObjectDoesNotExist:
            raise

        all_performances = PlayerCustomAnalysisPerformance.objects.filter(
            custom_analysis=custom_analysis
        ).select_related(
            'player',
            'player__team'
        )

        filtered_performances = all_performances
        if filter_payload.team:
            filtered_performances = filtered_performances.filter(player__team__code=filter_payload.team)
        if filter_payload.players:
            filtered_performances = filtered_performances.filter(player__gamertag_clean__in=filter_payload.players)

        all_sorted_performances = sorted(all_performances, key=lambda x: x.player.gamertag_clean)
        player_performance_data = {}
        for performance in all_sorted_performances:
            player_performance_data[performance.player.gamertag_clean] = create_general_performance_dict(performance)

        response = {
            "id": custom_analysis.id,
            "created": custom_analysis.created,
            "last_modified": custom_analysis.last_modified,
            "title": custom_analysis.title,
            "thumbnail": custom_analysis.thumbnail,
            "mapset": build_mapset_structure(custom_analysis),
            "player_performance_data": player_performance_data
        }

        if filter_payload.team or filter_payload.players:
            filtered_sorted_performances = sorted(filtered_performances, key=lambda x: x.player.gamertag_clean)
            filtered_player_performance_data = {}
            for performance in filtered_sorted_performances:
                filtered_player_performance_data[performance.player.gamertag_clean] = create_general_performance_dict(
                    performance
                )
            response["filtered_player_performance_data"] = filtered_player_performance_data

        return response
    except ValidationError as ve:
        logger.error(f"Validation error in generate_custom_analysis_response: {ve}")
        raise ValidationError(f"Invalid data: {str(ve)}")
    except Exception as e:
        logger.error(f"Unexpected error in generate_custom_analysis_response: {e}")
        raise Exception(f"Error processing custom analysis: {str(e)}")


def process_performances(analysis, performances):
    """
        This processes and sorts player performances by team and player name.

        args:
            - analysis [MapAnalysis, SeriesAnalysis, CustomAnalysis]: The analysis object containing team information
            - performances [QuerySet]: QuerySet of Performance objects to be processed
        returns:
            - sorted_performances [List]: A list of performances sorted by team (team one first) and player name
        raises:
            - ValidationError: If invalid team assignments are found
            - Exception: For unexpected errors during processing
    """
    try:
        team_one_performances = []
        team_two_performances = []

        for performance in performances:
            if performance.player.team_id == analysis.team_one_id:
                team_one_performances.append(performance)
            elif performance.player.team_id == analysis.team_two_id:
                team_two_performances.append(performance)
            else:
                continue

        team_one_performances.sort(key=lambda x: x.player.gamertag_clean)
        team_two_performances.sort(key=lambda x: x.player.gamertag_clean)

        return team_one_performances + team_two_performances
    except Exception as e:
        logger.error(f"Unexpected error in process_performances: {e}")
        raise Exception(f"Error processing player performances: {str(e)}")

def create_map_performance_dict(map_analysis, performance):
    """
        This creates a dictionary containing all performance statistics for a player in a map.

        args:
            - map_analysis [MapAnalysis]: The map analysis object containing game mode information
            - performance [PlayerMapPerformance]: The performance object containing player statistics
        returns:
            - performance_dict [Dict]: Dictionary containing all relevant performance statistics
        raises:
            - ValidationError: If required performance data is missing or invalid
            - GameModeError: If game mode specific data is invalid
            - Exception: For unexpected errors during processing
    """
    try:
        perf_dict = {
            "kills": performance.kills,
            "deaths": performance.deaths,
            "kdRatio": performance.kd_ratio,
            "assists": performance.assists,
            "ntk": performance.ntk
        }

        game_mode = map_analysis.game_mode.code
        if game_mode == 'hp':
            if not hasattr(performance, 'playermapperformancehp'):
                raise ValidationError("Missing Hardpoint performance data")

            hp_stats = performance.playermapperformancehp
            perf_dict.update({
                "dmg": hp_stats.damage,
                "ht": parse_seconds_to_time(hp_stats.hill_time),
                "avgHt": parse_seconds_to_time(hp_stats.average_hill_time),
                "objKills": hp_stats.objective_kills,
                "contHt": parse_seconds_to_time(hp_stats.contested_hill_time),
                "kph": round(hp_stats.kills_per_hill, 2),
                "dph": round(hp_stats.damage_per_hill, 2)
            })
        elif game_mode == 'snd':
            if not hasattr(performance, 'playermapperformancesnd'):
                raise ValidationError("Missing Search and Destroy performance data")

            snd_stats = performance.playermapperformancesnd
            perf_dict.update({
                "bombsPlanted": snd_stats.bombs_planted,
                "bombsDefused": snd_stats.bombs_defused,
                "firstBloods": snd_stats.first_bloods,
                "firstDeaths": snd_stats.first_deaths,
                "kpr": round(snd_stats.kills_per_round, 2),
                "dpr": round(snd_stats.damage_per_round, 2)
            })
        elif game_mode == 'ctrl':
            if not hasattr(performance, 'playermapperformancecontrol'):
                raise ValidationError("Missing Control performance data")

            ctrl_stats = performance.playermapperformancecontrol
            perf_dict.update({
                "tiersCaptured": ctrl_stats.tiers_captured,
                "objKills": ctrl_stats.objective_kills,
                "offenseKills": ctrl_stats.offense_kills,
                "defenseKills": ctrl_stats.defense_kills,
                "kpr": round(ctrl_stats.kills_per_round, 2),
                "dpr": round(ctrl_stats.damage_per_round, 2)
            })

        return perf_dict
    except ValidationError as ve:
        logger.error(f"Validation error in generate_map_analysis_response: {str(ve)}")
        raise Exception(f"Validation error creating performance dictionary: {str(ve)}")
    except Exception as e:
        logger.error(f"Unexpected error in create_performance_dict: {e}")
        raise Exception(f"Error creating performance dictionary: {str(e)}")

def create_general_performance_dict(performance):
    """
    This creates a dictionary containing all performance statistics for a player in a series or custom analysis.

    args:
        - analysis [SeriesAnalysis or CustomAnalysis]: The analysis object containing series information
        - performance [Series or Custom Performance]: The performance object containing player statistics
    returns:
        - performance_dict [Dict]: Dictionary containing all relevant performance statistics
    raises:
        - ValidationError: If required performance data is missing or invalid
        - Exception: For unexpected errors during processing
    """
    try:
        if hasattr(performance, 'series_kd_ratio'):
            kd_ratio = performance.series_kd_ratio
        elif hasattr(performance, 'custom_analysis_kd_ratio'):
            kd_ratio = performance.custom_analysis_kd_ratio
        else:
            raise ValidationError("Missing KD ratio field")

        perf_dict = {
            "total_kills": performance.total_kills,
            "total_deaths": performance.total_deaths,
            "kd": kd_ratio,
            "total_assists": performance.total_assists,
            "total_ntk": performance.total_ntk
        }

        return perf_dict
    except ValidationError as ve:
        logger.error(f"Validation error in create_general_performance_dict: {str(ve)}")
        raise ValidationError(f"Validation error creating performance dictionary: {str(ve)}")
    except Exception as e:
        logger.error(f"Unexpected error in create_general_performance_dict: {e}")
        raise Exception(f"Error creating performance dictionary: {str(e)}")

def build_mapset_structure(custom_analysis):
    """
    This builds the hierarchical mapset structure for a custom analysis.

    args:
        - custom_analysis [CustomAnalysis]: The custom analysis object containing the map analyses
    returns:
        - mapset [Dict]: Dictionary containing the hierarchical tournament-series-map structure
    raises:
        - ValidationError: If required relationships are missing
        - Exception: For unexpected errors during processing
    """
    try:
        map_analyses = MapAnalysis.objects.filter(
            customanalysismapanalysis__custom_analysis=custom_analysis
        ).select_related(
            'tournament',
            'series_analysis'
        ).order_by('-played_date')

        tournaments_dict = {}
        for map_analysis in map_analyses:
            tournament = map_analysis.tournament
            series = map_analysis.series_analysis

            if tournament.id not in tournaments_dict:
                tournaments_dict[tournament.id] = {
                    "id": tournament.id,
                    "title": tournament.title,
                    "series": {}
                }

            series_id = series.id if series else 'no_series'
            if series_id not in tournaments_dict[tournament.id]["series"]:
                tournaments_dict[tournament.id]["series"][series_id] = {
                    "id": series.id if series else None,
                    "title": series.title if series else None,
                    "maps": []
                }

            tournaments_dict[tournament.id]["series"][series_id]["maps"].append({
                "id": map_analysis.id,
                "title": map_analysis.title
            })

        tournaments_list = []
        for tournament_id, tournament_data in tournaments_dict.items():
            series_list = []
            for series_id, series_data in tournament_data["series"].items():
                series_list.append(series_data)

            tournament_data["series"] = sorted(series_list, key=lambda x: x["id"] if x["id"] else 0)
            tournaments_list.append(tournament_data)

        return {"tournaments": sorted(tournaments_list, key=lambda x: x["id"])}
    except Exception as e:
        logger.error(f"Unexpected error in build_mapset_structure: {e}")
        raise Exception(f"Error building mapset structure: {str(e)}")
