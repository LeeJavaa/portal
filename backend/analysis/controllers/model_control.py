from typing import Dict, Any

import logging
from analysis.models import (
    CustomAnalysis,
    CustomAnalysisMapAnalysis,
    MapAnalysis,
    PlayerCustomAnalysisPerformance,
    PlayerMapPerformance,
    PlayerMapPerformanceHP,
    PlayerMapPerformanceSND,
    PlayerMapPerformanceControl,
    PlayerSeriesPerformance,
    SeriesAnalysis
)
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db import transaction
from django.utils import timezone
from general.models import GameMode, Map, Player, Team, Tournament
from utils.analysis_handling import parse_kd, parse_time_to_seconds

logger = logging.getLogger('gunicorn.error')

def create_map_analysis(payload: Dict[str, Any]) -> int:
    """
    Creates a single map analysis object from the request payload.

    args:
        - payload [ninja.Schema]: A schema containing the request payload.
    returns:
        - id [int]: The id of the created map analysis object
    raises:
        -
    """
    try:
        if payload.played_date > timezone.now():
            raise ValidationError("Played date cannot be in the future")

        try:
            tournament = Tournament.objects.get(id=payload.tournament)
        except ObjectDoesNotExist:
            raise ObjectDoesNotExist(f"Tournament with id {payload.tournament} does not exist")

        try:
            team_one = Team.objects.get(code=payload.team_one.lower())
            team_two = Team.objects.get(code=payload.team_two.lower())
        except ObjectDoesNotExist as e:
            raise ObjectDoesNotExist(f"Team with code {str(e)} does not exist")

        try:
            game_mode = GameMode.objects.get(code=payload.game_mode.lower())
        except ObjectDoesNotExist:
            raise ObjectDoesNotExist(f"Game mode {payload.game_mode} does not exist")

        try:
            map_object = Map.objects.get(name=payload.map.lower())
        except ObjectDoesNotExist:
            raise ObjectDoesNotExist(f"Map {payload.map} does not exist")

        if payload.team_one_score == payload.team_two_score:
            raise ValidationError("Scores can not be equal")
        winner = team_one if payload.team_one_score > payload.team_two_score else team_two

        player_objects = {}
        for player_name in payload.player_stats.keys():
            try:
                player_objects[player_name] = Player.objects.get(gamertag_dirty=player_name)
            except ObjectDoesNotExist:
                raise ObjectDoesNotExist(f"Player {player_name} does not exist. Are you sure that's their gamer tag?")

        thumbnail = f"{map_object.name.lower()}_{team_one.code.lower()}_{team_two.code.lower()}"

        with transaction.atomic():
            map_analysis = MapAnalysis.objects.create(
                tournament=tournament,
                title=payload.title,
                thumbnail=thumbnail,
                screenshot=payload.scoreboard_file_name,
                team_one=team_one,
                team_two=team_two,
                team_one_score=payload.team_one_score,
                team_two_score=payload.team_two_score,
                winner=winner,
                played_date=payload.played_date,
                map=map_object,
                game_mode=game_mode
            )

            for player_name, stats in payload.player_stats.items():
                kills, deaths = parse_kd(stats['kd'])
                kd_ratio = kills / deaths if deaths > 0 else kills

                player_perf = PlayerMapPerformance.objects.create(
                    map_analysis=map_analysis,
                    player=player_objects[player_name],
                    kills=kills,
                    deaths=deaths,
                    kd_ratio=kd_ratio,
                    assists=int(stats['assists']),
                    ntk=int(stats['non_traded_kills'])
                )

                if game_mode == GameMode.objects.get(code='hp'):
                    PlayerMapPerformanceHP.objects.create(
                        player_performance=player_perf,
                        highest_streak=int(stats['highest_streak']),
                        damage=int(stats['damage']),
                        hill_time=parse_time_to_seconds(stats['hill_time']),
                        average_hill_time=parse_time_to_seconds(stats['average_hill_time']),
                        objective_kills=int(stats['objective_kills']),
                        contested_hill_time=parse_time_to_seconds(stats['contested_hill_time']),
                        kills_per_hill=float(stats['kills_per_hill']),
                        damage_per_hill=float(stats['damage_per_hill'])
                    )
                elif game_mode == GameMode.objects.get(code='snd'):
                    PlayerMapPerformanceSND.objects.create(
                        player_performance=player_perf,
                        bombs_planted=int(stats.get('boms_planted', 0)),
                        bombs_defused=int(stats.get('bombs_defused', 0)),
                        first_bloods=int(stats.get('first_bloods', 0)),
                        first_deaths=int(stats.get('first_deaths', 0)),
                        kills_per_round=float(stats['kills_per_round']),
                        damage_per_round=float(stats['damage_per_round'])
                    )
                elif game_mode == GameMode.objects.get(code='ctl'):
                    PlayerMapPerformanceControl.objects.create(
                        player_performance=player_perf,
                        tiers_captured=int(stats.get('tiers_captured', 0)),
                        objective_kills=int(stats['objective_kills']),
                        offense_kills=int(stats.get('offensive_kills', 0)),
                        defense_kills=int(stats.get('defensive_kills', 0)),
                        kills_per_round=float(stats['kills_per_round']),
                        damage_per_round=float(stats['damage_per_round'])
                    )

            try:
                map_analysis.full_clean()
            except ValidationError as e:
                # If validation fails, the transaction will be rolled back
                raise ValidationError(f"Data validation failed: {str(e)}")

        return map_analysis.id
    except ValidationError as e:
        logger.error(f"Error creating map analysis: {str(e)}")
        raise ValidationError(f"Validation error: {str(e)}")
    except ObjectDoesNotExist as e:
        logger.error(f"Object {str(e)} does not exist when creating map analysis")
        raise ObjectDoesNotExist(f"Object not found: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error creating map analysis: {str(e)}")
        raise Exception(f"Unexpected error creating map analysis: {str(e)}")

def create_series_analysis(map_ids, title):
    """
    Creates a single series analysis object from the map analyses that were provided.

    args:
        - map_ids [List]: A list of map analysis object ids that will make up the series analysis.
        - title [Str]: The title of the series analysis
    returns:
        - id [int]: The id of the created series analysis object
    raises:
        - ValidationError: If less than 3 maps are provided
        - ValidationError: If maps don't belong to the same teams
        - ValidationError: If maps don't belong to the same tournament
        - ValidationError: If neither team has won 3 maps
    """
    try:
        series_length = len(map_ids)
        if series_length < 3:
            raise ValidationError("A series must contain at least 3 maps")
        if series_length > 5:
            raise ValidationError("A series cannot contain more than 5 maps")

        map_analyses = MapAnalysis.objects.filter(id__in=map_ids)

        if len(map_analyses) != series_length:
            raise ValidationError("One or more map IDs do not exist")

        maps_in_series = map_analyses.filter(series_analysis__isnull=False)
        if maps_in_series.exists():
            map_ids_in_series = list(maps_in_series.values_list('id', flat=True))
            raise ValidationError(
                f"Maps with IDs {map_ids_in_series} are already part of another series"
            )

        first_map = map_analyses[0]

        tournaments = set(map_analysis.tournament_id for map_analysis in map_analyses)
        if len(tournaments) > 1:
            raise ValidationError("All maps must belong to the same tournament")

        teams = set()
        for map_analysis in map_analyses:
            teams.add(map_analysis.team_one_id)
            teams.add(map_analysis.team_two_id)

        if len(teams) != 2:
            raise ValidationError("All maps must be between the same two teams")

        team_wins = {}
        for map_analysis in map_analyses:
            team_wins[map_analysis.winner_id] = team_wins.get(map_analysis.winner_id, 0) + 1

        winning_team_id = None
        for team_id, wins in team_wins.items():
            if wins >= 3:
                winning_team_id = team_id
                break

        if not winning_team_id:
            raise ValidationError("Neither team has won 3 maps in this series")

        earliest_played_date = min(map_analysis.played_date for map_analysis in map_analyses)

        player_map_performances = PlayerMapPerformance.objects.filter(
            map_analysis__in=map_analyses
        ).select_related('player')

        player_series_stats = {}
        for performance in player_map_performances:
            player_id = performance.player_id
            if player_id not in player_series_stats:
                player_series_stats[player_id] = {
                    'player': performance.player,
                    'total_kills': 0,
                    'total_deaths': 0,
                    'total_assists': 0,
                    'total_ntk': 0
                }

            stats = player_series_stats[player_id]
            stats['total_kills'] += performance.kills
            stats['total_deaths'] += performance.deaths
            stats['total_assists'] += performance.assists
            stats['total_ntk'] += performance.ntk

        first_map_select = map_analyses.select_related('map', 'team_one', 'team_two')[0]
        thumbnail = f"{first_map_select.map.name.lower()}_{first_map_select.team_one.code.lower()}_{first_map_select.team_two.code.lower()}"

        with transaction.atomic():
            series_analysis = SeriesAnalysis.objects.create(
                tournament=first_map.tournament,
                title=title,
                thumbnail=thumbnail,
                winner_id=winning_team_id,
                played_date=earliest_played_date,
                team_one=first_map.team_one,
                team_two=first_map.team_two,
                team_one_map_count=team_wins.get(first_map.team_one_id, 0),
                team_two_map_count=team_wins.get(first_map.team_two_id, 0)
            )

            map_analyses.update(series_analysis=series_analysis)

            player_series_performances = []
            for player_id, stats in player_series_stats.items():
                total_kills = stats['total_kills']
                total_deaths = stats['total_deaths']
                series_kd_ratio = (
                    float(total_kills) / total_deaths if total_deaths > 0 else float(total_kills)
                )

                performance = PlayerSeriesPerformance(
                    series_analysis=series_analysis,
                    player=stats['player'],
                    total_kills=total_kills,
                    total_deaths=total_deaths,
                    series_kd_ratio=series_kd_ratio,
                    total_assists=stats['total_assists'],
                    total_ntk=stats['total_ntk']
                )
                player_series_performances.append(performance)

            # Bulk create all player series performances
            PlayerSeriesPerformance.objects.bulk_create(player_series_performances)

            return series_analysis

    except ValidationError as e:
        logger.error(f"Error creating series analysis: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error creating series analysis: {str(e)}")
        raise ValidationError(f"Error creating series analysis: {str(e)}")

def create_custom_analysis_from_maps(title, map_ids):
    """
    Creates a single custom analysis object from the map analyses that were provided.

    args:
        - title [Str]: The title of the custom analysis
        - map_ids [List]: A list of map analysis object ids that will make up the custom analysis.
    returns:
        - id [int]: The id of the created custom analysis object
    raises:
        -
    """
    try:
        if len(map_ids) < 2:
            raise ValidationError("At least two map IDs must be provided")

        map_analyses = MapAnalysis.objects.filter(id__in=map_ids)

        if len(map_analyses) != len(map_ids):
            raise ValidationError("One or more map IDs provided do not exist")

        player_map_performances = PlayerMapPerformance.objects.filter(
            map_analysis__in=map_analyses
        ).select_related('player')

        player_custom_analysis_stats = {}
        for performance in player_map_performances:
            player_id = performance.player_id
            if player_id not in player_custom_analysis_stats:
                player_custom_analysis_stats[player_id] = {
                    'player': performance.player,
                    'total_kills': 0,
                    'total_deaths': 0,
                    'total_assists': 0,
                    'total_ntk': 0
                }

            stats = player_custom_analysis_stats[player_id]
            stats['total_kills'] += performance.kills
            stats['total_deaths'] += performance.deaths
            stats['total_assists'] += performance.assists
            stats['total_ntk'] += performance.ntk

        with transaction.atomic():
            custom_analysis = CustomAnalysis.objects.create(
                title=title,
            )

            custom_analysis_map_relations = [
                CustomAnalysisMapAnalysis(
                    custom_analysis=custom_analysis,
                    map_analysis=map_analysis
                )
                for map_analysis in map_analyses
            ]
            CustomAnalysisMapAnalysis.objects.bulk_create(custom_analysis_map_relations)

            player_performances = []
            for player_id, stats in player_custom_analysis_stats.items():
                total_kills = stats['total_kills']
                total_deaths = stats['total_deaths']
                custom_analysis_kd_ratio = (
                    float(total_kills) / total_deaths if total_deaths > 0 else float(total_kills)
                )

                performance = PlayerCustomAnalysisPerformance(
                    custom_analysis=custom_analysis,
                    player=stats['player'],
                    total_kills=total_kills,
                    total_deaths=total_deaths,
                    custom_analysis_kd_ratio=custom_analysis_kd_ratio,
                    total_assists=stats['total_assists'],
                    total_ntk=stats['total_ntk']
                )
                player_performances.append(performance)

            PlayerCustomAnalysisPerformance.objects.bulk_create(player_performances)

            return custom_analysis
    except ValidationError as e:
        logger.error(f"Error creating custom analysis from maps: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error creating custom analysis from maps: {str(e)}")
        raise ValidationError(f"Error creating custom analysis: {str(e)}")

def create_custom_analysis_from_series(title, series_ids):
    """
    Creates a single custom analysis object from the series analyses that were provided.

    args:
        - series_ids [List]: A list of series analysis object ids that will make up the custom analysis.
    returns:
        - id [int]: The id of the created custom analysis object
    raises:
        -
    """
    try:
        if len(series_ids) < 2:
            raise ValidationError("At least two series must be provided")

        series_analyses = SeriesAnalysis.objects.filter(id__in=series_ids)

        if len(series_analyses) != len(series_ids):
            raise ValidationError("One or more series IDs provided do not exist")

        map_ids = list(MapAnalysis.objects.filter(
            series_analysis__in=series_analyses
        ).values_list('id', flat=True))

        if not map_ids:
            raise ValidationError("No maps found in the provided series")

        return create_custom_analysis_from_maps(title, map_ids)
    except ValidationError as e:
            logger.error(f"Error creating custom analysis from series: {str(e)}")
            raise
    except Exception as e:
        logger.error(f"Unexpected error creating custom analysis from series: {str(e)}")
        raise ValidationError(f"Error creating custom analysis from series: {str(e)}")

def delete_map_analyses(map_analyses_ids):
    """
    Deletes a group of map analyses, according to the list of ids given.

    args:
        - map_analyses_ids [List]: list of map analyses ids
    returns:
        - status [bool]: whether the deletion was successful
        - count [int]: amount of map analysis objects deleted
    raises:
        -
    """
    try:
        if not map_analyses_ids:
            raise ValidationError("No map analysis IDs provided")

        successful_deletions = 0
        failed_ids = []

        for map_analysis_id in map_analyses_ids:
            try:
                response = delete_map_analysis(map_analysis_id)
                if response == 'success':
                    successful_deletions += 1
            except ValidationError:
                failed_ids.append(map_analysis_id)

        if failed_ids:
            raise ValidationError(
                f"Failed to delete map analyses with IDs: {failed_ids}. "
                f"Successfully deleted {successful_deletions} map analyses."
            )

        return {
            "status": 'success',
            "count": successful_deletions
        }
    except ValidationError as e:
        logger.error(f"Error during bulk map analyses deletion: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error during bulk map analyses deletion: {str(e)}")
        raise ValidationError(f"Error during bulk map analyses deletion: {str(e)}")

def delete_series_analyses(series_analyses_ids):
    """
    Deletes a group of series analyses, according to the list of ids given.

    args:
        - series_analyses_ids [List]: list of series analyses ids
    returns:
        - success [bool]: whether the deletion was successful
        - count [int]: amount of series analysis objects deleted
    raises:
        -
    """
    try:
        if not series_analyses_ids:
            raise ValidationError("No series analysis IDs provided")

        successful_deletions = 0
        failed_ids = []

        for series_analysis_id in series_analyses_ids:
            try:
                response = delete_series_analysis(series_analysis_id)
                if response == 'success':
                    successful_deletions += 1
            except ValidationError:
                failed_ids.append(series_analysis_id)

        if failed_ids:
            raise ValidationError(
                f"Failed to delete series analyses with IDs: {failed_ids}. "
                f"Successfully deleted {successful_deletions} series analyses."
            )

        return {
            "status": 'success',
            "count": successful_deletions
        }
    except ValidationError as e:
        logger.error(f"Error during bulk series analyses deletion: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error during bulk series analyses deletion: {str(e)}")
        raise ValidationError(f"Error during bulk series analyses deletion: {str(e)}")

def delete_custom_analyses(custom_analyses_ids):
    """
    Deletes a group of custom analyses, according to the list of ids given.

    args:
        - custom_analyses_ids [List]: list of custom analyses ids
    returns:
        - success [bool]: whether the deletion was successful
        - count [int]: amount of custom analysis objects deleted
    raises:
        -
    """
    try:
        if not custom_analyses_ids:
            raise ValidationError("No custom analysis IDs provided")

        successful_deletions = 0
        failed_ids = []

        for custom_analysis_id in custom_analyses_ids:
            try:
                response = delete_custom_analysis(custom_analysis_id)
                if response == 'success':
                    successful_deletions += 1
            except ValidationError:
                failed_ids.append(custom_analysis_id)

        if failed_ids:
            raise ValidationError(
                f"Failed to delete custom analyses with IDs: {failed_ids}. "
                f"Successfully deleted {successful_deletions} custom analyses."
            )

        return {
            "status": 'success',
            "count": successful_deletions
        }
    except ValidationError as e:
        logger.error(f"Error during bulk custom analyses deletion: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error during bulk custom analyses deletion: {str(e)}")
        raise ValidationError(f"Error during bulk custom analyses deletion: {str(e)}")

def delete_map_analysis(map_analysis_id):
    """
    Deletes a single map analysis, according to the id given.

    args:
        - map_analysis_id [int]: the id of the map analysis object to delete
    returns:
        - success [bool]: whether the deletion was successful
    raises:
        -
    """
    try:
        map_analysis = MapAnalysis.objects.filter(id=map_analysis_id).first()

        if not map_analysis:
            raise ValidationError(f"Map analysis with ID {map_analysis_id} does not exist")

        map_analysis.delete()
        return "success"
    except ValidationError as e:
        logger.error(f"Error during map analysis deletion: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error during map analysis deletion: {str(e)}")
        raise ValidationError(f"Error deleting map analysis: {str(e)}")

def delete_series_analysis(series_analysis_id):
    """
    Deletes a single series analysis, according to the id given.

    args:
        - series_analysis_id [int]: the id of the series analysis object to delete
    returns:
        - success [bool]: whether the deletion was successful
    raises:
        -
    """
    try:
        series_analysis = SeriesAnalysis.objects.filter(id=series_analysis_id).first()

        if not series_analysis:
            raise ValidationError(f"Series analysis with ID {series_analysis_id} does not exist")

        series_analysis.delete()
        return "success"
    except ValidationError as e:
        logger.error(f"Error during series analysis deletion: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error during series analysis deletion: {str(e)}")
        raise ValidationError(f"Error deleting series analysis: {str(e)}")

def delete_custom_analysis(custom_analysis_id):
    """
    Deletes a single custom analysis, according to the id given.

    args:
        - custom_analysis_id [int]: the id of the custom analysis object to delete
    returns:
        - success [bool]: whether the deletion was successful
    raises:
        -
    """
    try:
        custom_analysis = CustomAnalysis.objects.filter(id=custom_analysis_id).first()

        if not custom_analysis:
            raise ValidationError(f"Custom analysis with ID {custom_analysis_id} does not exist")

        custom_analysis.delete()
        return "success"
    except ValidationError as e:
        logger.error(f"Error during series analysis deletion: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error during series analysis deletion: {str(e)}")
        raise ValidationError(f"Error deleting custom analysis: {str(e)}")