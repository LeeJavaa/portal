from typing import Dict, List

import logging
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from general.models import GameMode, Map, Player, Team, Tournament

logger = logging.getLogger('gunicorn.error')

def generate_general_data_response() -> Dict:
    """
    Fetches and formats all general data for frontend use.
    Includes teams, players, game modes, maps, and tournaments.

    args:
        None
    returns:
        - general_data [Dict]: Dictionary containing all formatted general data
    raises:
        - ObjectDoesNotExist: If required data is missing from the database
        - ValidationError: If data validation fails
        - Exception: For unexpected errors during data processing
    """
    try:
        # Fetch and validate teams
        teams_dict = {}
        for team in Team.objects.all():
            if not team.code or not team.name:
                raise ValidationError(f"Invalid team data for team ID {team.id}")

            key = team.name.upper().replace(" ", "_")
            teams_dict[key] = {
                "code": team.code,
                "name": team.name,
                "identifiers": generate_team_identifiers(team.name, team.code)
            }

        # Fetch and validate players
        players_dict = {}
        for player in Player.objects.all():
            if not player.gamertag_clean or not player.gamertag_dirty:
                raise ValidationError(f"Invalid player data for player ID {player.id}")

            key = player.gamertag_clean.upper().replace(" ", "_")
            players_dict[key] = {
                "dirty": player.gamertag_dirty,
                "clean": player.gamertag_clean
            }

        # Fetch and validate game modes
        game_modes_dict = {}
        for mode in GameMode.objects.all():
            if not mode.code or not mode.name:
                raise ValidationError(f"Invalid game mode data for mode ID {mode.id}")

            key = mode.name.upper().replace(" ", "_")
            game_modes_dict[key] = {
                "code": mode.code,
                "name": mode.name,
                "identifiers": generate_game_mode_identifiers(mode.name, mode.code)
            }

        # Fetch and validate maps
        maps_dict = {}
        for map_obj in Map.objects.all():
            if not map_obj.name:
                raise ValidationError(f"Invalid map data for map ID {map_obj.id}")

            key = map_obj.name.upper().replace(" ", "_")
            maps_dict[key] = {
                "code": map_obj.name.lower().replace(" ", ""),
                "name": map_obj.name
            }

        # Fetch and validate tournaments
        tournaments_dict = {}
        for tournament in Tournament.objects.order_by('-played_date'):
            if not tournament.title or not tournament.id:
                raise ValidationError(f"Invalid tournament data for tournament ID {tournament.id}")

            key = tournament.title.upper().replace(" ", "_")
            tournaments_dict[key] = {
                "id": tournament.id,
                "name": tournament.title
            }

        reference_data = {
            "teams": teams_dict,
            "players": players_dict,
            "game_modes": game_modes_dict,
            "maps": maps_dict,
            "tournaments": tournaments_dict
        }

        return reference_data
    except ObjectDoesNotExist as dne:
        logger.error(f"Data not found error in get_reference_data: {dne}")
        raise ObjectDoesNotExist(f"Required data not found: {str(dne)}")
    except ValidationError as ve:
        logger.error(f"Validation error in get_reference_data: {ve}")
        raise ValidationError(f"Invalid reference data: {str(ve)}")
    except Exception as e:
        logger.error(f"Unexpected error in get_reference_data: {e}")
        raise Exception(f"Error processing reference data: {str(e)}")

def generate_team_identifiers(team_name: str, team_code: str) -> List[str]:
    """
    Generates a list of common identifiers for a team based on its name and code.

    args:
        - team_name [str]: The full name of the team
        - team_code [str]: The team's code identifier
    returns:
        - identifiers [List[str]]: List of generated identifier strings for the team
    raises:
        - ValidationError: If team_name or team_code are invalid
        - Exception: For unexpected errors during identifier generation
    """
    try:
        if not team_name or not team_code:
            raise ValidationError("Team name and code are required")

        name_lower = team_name.lower()
        identifiers = [name_lower]

        # Add variations without spaces
        if " " in name_lower:
            identifiers.append(name_lower.replace(" ", ""))

        # Add the team name part (e.g., "faze" from "atlanta faze")
        if " " in name_lower:
            identifiers.append(name_lower.split(" ")[-1])

        # Add the team location part (e.g., "atlanta" from "atlanta faze")
        if " " in name_lower:
            identifiers.append(name_lower.split(" ")[0])

        return identifiers
    except ValidationError as ve:
        logger.error(f"Validation error in generate_team_identifiers: {ve}")
        raise ValidationError(f"Invalid team data: {str(ve)}")
    except Exception as e:
        logger.error(f"Unexpected error in generate_team_identifiers: {e}")
        raise Exception(f"Error generating team identifiers: {str(e)}")


def generate_game_mode_identifiers(mode_name: str, mode_code: str) -> List[str]:
    """
    Generates a list of common identifiers for a game mode based on its name and code.

    args:
        - mode_name [str]: The full name of the game mode
        - mode_code [str]: The game mode's code identifier
    returns:
        - identifiers [List[str]]: List of generated identifier strings for the game mode
    raises:
        - ValidationError: If mode_name or mode_code are invalid
        - Exception: For unexpected errors during identifier generation
    """
    try:
        if not mode_name or not mode_code:
            raise ValidationError("Game mode name and code are required")

        name_lower = mode_name.lower()
        identifiers = [name_lower]

        # Add variations without spaces
        if " " in name_lower:
            identifiers.append(name_lower.replace(" ", ""))

        # Add each word separately (e.g., "search" from "search and destroy")
        if " " in name_lower:
            words = name_lower.split(" ")
            for word in words:
                if word not in ["and", "or", "the"]:
                    identifiers.append(word)

        return identifiers
    except ValidationError as ve:
        logger.error(f"Validation error in generate_game_mode_identifiers: {ve}")
        raise ValidationError(f"Invalid game mode data: {str(ve)}")
    except Exception as e:
        logger.error(f"Unexpected error in generate_game_mode_identifiers: {e}")
        raise Exception(f"Error generating game mode identifiers: {str(e)}")
