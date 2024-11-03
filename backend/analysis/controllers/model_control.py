from datetime import datetime
from typing import Dict, Any

from analysis.models import (
    CustomAnalysis,
    MapAnalysis,
    PlayerMapPerformance,
    PlayerMapPerformanceHP,
    PlayerMapPerformanceSND,
    PlayerMapPerformanceControl,
    SeriesAnalysis
)
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db import transaction
from django.utils import timezone
from general.models import GameMode, Map, Player, Team, Tournament
from utils.analysis_handling import parse_kd, parse_time_to_seconds

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

        with transaction.atomic():
            map_analysis = MapAnalysis.objects.create(
                tournament=tournament,
                title=payload.title,
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
                kills, deaths = parse_kd(stats['k/d'])
                kd_ratio = kills / deaths if deaths > 0 else kills

                player_perf = PlayerMapPerformance.objects.create(
                    map_analysis=map_analysis,
                    player=player_objects[player_name],
                    kills=kills,
                    deaths=deaths,
                    kd_ratio=kd_ratio,
                    assists=int(stats['assists']),
                    ntk=int(stats['ntk'])
                )

                if game_mode == GameMode.objects.get(code='hp'):
                    PlayerMapPerformanceHP.objects.create(
                        player_performance=player_perf,
                        highest_streak=int(stats['hs']),
                        damage=int(stats['dmg']),
                        hill_time=parse_time_to_seconds(stats['ht']),
                        average_hill_time=parse_time_to_seconds(stats['avg_ht']),
                        objective_kills=int(stats['obj_kills']),
                        contested_hill_time=parse_time_to_seconds(stats['cont_ht']),
                        kills_per_hill=float(stats['kph']),
                        damage_per_hill=float(stats['dph'])
                    )
                elif game_mode == GameMode.objects.get(code='snd'):
                    PlayerMapPerformanceSND.objects.create(
                        player_performance=player_perf,
                        bombs_planted=int(stats.get('planted', 0)),
                        bombs_defused=int(stats.get('defused', 0)),
                        first_bloods=int(stats.get('fb', 0)),
                        first_deaths=int(stats.get('fd', 0)),
                        kills_per_round=float(stats['kpr']),
                        damage_per_round=float(stats['dpr'])
                    )
                elif game_mode == GameMode.objects.get(code='ctl'):
                    PlayerMapPerformanceControl.objects.create(
                        player_performance=player_perf,
                        tiers_captured=int(stats.get('tiers', 0)),
                        objective_kills=int(stats['obj_kills']),
                        offense_kills=int(stats.get('off_kills', 0)),
                        defense_kills=int(stats.get('def_kills', 0)),
                        kills_per_round=float(stats['kpr']),
                        damage_per_round=float(stats['dpr'])
                    )

            try:
                map_analysis.full_clean()
            except ValidationError as e:
                # If validation fails, the transaction will be rolled back
                raise ValidationError(f"Data validation failed: {str(e)}")

        return map_analysis.id
    except ValidationError as e:
        raise ValidationError(f"Validation error: {str(e)}")
    except ObjectDoesNotExist as e:
        raise ObjectDoesNotExist(f"Object not found: {str(e)}")
    except Exception as e:
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

        with transaction.atomic():
            series_analysis = SeriesAnalysis.objects.create(
                tournament=first_map.tournament,
                title=title,
                winner_id=winning_team_id,
                played_date=earliest_played_date,
                team_one=first_map.team_one,
                team_two=first_map.team_two,
                team_one_map_count=team_wins.get(first_map.team_one_id, 0),
                team_two_map_count=team_wins.get(first_map.team_two_id, 0)
            )

            map_analyses.update(series_analysis=series_analysis)

            return series_analysis

    except ValidationError:
        raise
    except Exception as e:
        raise ValidationError(f"Error creating series analysis: {str(e)}")



def create_custom_analysis_from_maps(map_ids):
    """
    Creates a single custom analysis object from the map analyses that were provided.

    args:
        - map_ids [List]: A list of map analysis object ids that will make up the custom analysis.
    returns:
        - id [int]: The id of the created custom analysis object
    raises:
        -
    """
    pass

def create_custom_analysis_from_series(series_ids):
    """
    Creates a single custom analysis object from the series analyses that were provided.

    args:
        - series_ids [List]: A list of series analysis object ids that will make up the custom analysis.
    returns:
        - id [int]: The id of the created custom analysis object
    raises:
        -
    """
    pass

def delete_map_analyses(map_analyses_ids):
    """
    Deletes a group of map analyses, according to the list of ids given.

    args:
        - map_analyses_ids [List]: list of map analyses ids
    returns:
        - success [bool]: whether the deletion was successful
        - count [int]: amount of map analysis objects deleted
    raises:
        -
    """
    pass

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
    pass

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
    pass

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
    pass

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
    pass

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
    pass