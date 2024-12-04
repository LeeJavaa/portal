import os
import sys
from pathlib import Path
from typing import List


import django
from django.db import IntegrityError
from django.core.exceptions import ObjectDoesNotExist

# This is to run Django in a standalone configuration
project_path = Path(__file__).resolve().parent
sys.path.append(str(project_path))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# Import after django setup
from general.models import Team, Player

TEAM_DATA = [
    {
        'code': 'nxh',
        'name': 'Nixuh'
    },
    {
        'code': 'hb',
        'name': 'High Born'
    },
    {
        'code': 'ee',
        'name': 'Elevate Esports'
    },
    {
        'code': 'ag',
        'name': 'Aerial Gaming'
    },
]

PLAYER_DATA = [
    {
        'full_name': 'Raees',
        'gamertag_clean': 'Magicz',
        'gamertag_dirty': 'Magicz',
        'team': 'nxh'
    },
    {
        'full_name': 'Rahil',
        'gamertag_clean': 'Raz',
        'gamertag_dirty': 'Raz',
        'team': 'nxh'
    },
    {
        'full_name': 'Jameen',
        'gamertag_clean': 'Enigma',
        'gamertag_dirty': 'Enigma',
        'team': 'nxh'
    },
    {
        'full_name': 'Adnaan',
        'gamertag_clean': 'Adnaan',
        'gamertag_dirty': 'Adnaan',
        'team': 'nxh'
    },
    {
        'full_name': 'Otto',
        'gamertag_clean': 'Pluto',
        'gamertag_dirty': 'Pluto',
        'team': 'ee'
    },
    {
        'full_name': 'Ryan',
        'gamertag_clean': 'Rxynz',
        'gamertag_dirty': 'Rxynz',
        'team': 'ee'
    },
    {
        'full_name': 'Umar',
        'gamertag_clean': 'Hydro',
        'gamertag_dirty': 'Hydro',
        'team': 'ee'
    },
    {
        'full_name': 'Kyle Nortje',
        'gamertag_clean': 'Frosty',
        'gamertag_dirty': 'Frosty',
        'team': 'ee'
    },
    {
        'full_name': '',
        'gamertag_clean': 'Wretchy',
        'gamertag_dirty': 'Wretchy',
        'team': 'ag'
    },
    {
        'full_name': '',
        'gamertag_clean': 'Slixx',
        'gamertag_dirty': 'Slixx',
        'team': 'ag'
    },
    {
        'full_name': 'Ruan',
        'gamertag_clean': 'Mage',
        'gamertag_dirty': 'Mage',
        'team': 'ag'
    },
    {
        'full_name': 'Akshay',
        'gamertag_clean': 'Bevz',
        'gamertag_dirty': 'Bevz',
        'team': 'ag'
    },
    {
        'full_name': 'Cayden Beadsworth',
        'gamertag_clean': 'Heroz',
        'gamertag_dirty': 'Heroz',
        'team': 'hb'
    },
    {
        'full_name': '',
        'gamertag_clean': 'NoSolution',
        'gamertag_dirty': 'NoSolution',
        'team': 'hb'
    },
    {
        'full_name': '',
        'gamertag_clean': '999',
        'gamertag_dirty': '999',
        'team': 'hb'
    },
    {
        'full_name': '',
        'gamertag_clean': 'ZsaZsa',
        'gamertag_dirty': 'ZsaZsa',
        'team': 'hb'
    },
]

def create_teams(data: List[dict]) -> bool:
    """
    Populate the general_team table with the team set for the Monster 10k LAN.

    Args:
         - data (List[dict]): The team set for the Monster 10k LAN.

    Returns:
        - result (Bool): Whether all the teams were created successfully or not
    """
    success = True
    created_count = 0
    existing_count = 0
    error_count = 0

    print(f"\nAttempting to process {len(data)} teams...")

    for team_data in data:
        try:
            team_obj, created = Team.objects.get_or_create(
                code=team_data['code'],
                defaults={'name': team_data['name']}
            )

            if created:
                print(f"Successfully created new team: {team_obj.name} ({team_obj.code})")
                created_count += 1
            else:
                print(f"Team already exists: {team_obj.name} ({team_obj.code})")
                existing_count += 1
        except IntegrityError as e:
            print(
                f"Database integrity error while processing team '{team_data.get('name')}' ({team_data.get('code')}): {str(e)}")
            error_count += 1
            success = False
        except KeyError as e:
            print(f"Missing required field in team data: {str(e)}")
            error_count += 1
            success = False
        except Exception as e:
            print(
                f"Unexpected error while processing team '{team_data.get('name')}' ({team_data.get('code')}): {str(e)}")
            error_count += 1
            success = False

    print("\nSummary:")
    print(f"- Teams processed: {len(data)}")
    print(f"- New teams created: {created_count}")
    print(f"- Existing teams found: {existing_count}")
    print(f"- Errors encountered: {error_count}")

    return success

def create_players(data: List[dict]) -> bool:
    """
    Populate the general_player table with the player set for the Monster 10k LAN.

    Args:
         - data (List[dict]): The player set for the Monster 10k LAN.

    Returns:
        - result (Bool): Whether all the players were created successfully or not
    """
    success = True
    created_count = 0
    existing_count = 0
    error_count = 0

    print(f"\nAttempting to process {len(data)} players...")

    for player_data in data:
        try:
            team_code = player_data.pop('team')  # Remove team code from player_data
            team = Team.objects.get(code=team_code)

            player_obj, created = Player.objects.get_or_create(
                gamertag_clean=player_data['gamertag_clean'],
                defaults={
                    'full_name': player_data['full_name'],
                    'gamertag_dirty': player_data['gamertag_dirty'],
                    'team': team
                }
            )

            if created:
                print(
                    f"Successfully created new player: {player_obj.gamertag_clean} ({player_obj.full_name}) - {team.name}")
                created_count += 1
            else:
                print(f"Player already exists: {player_obj.gamertag_clean} ({player_obj.full_name}) - {team.name}")
                existing_count += 1
        except ObjectDoesNotExist:
            print(f"Error: Team with code '{team_code}' not found for player {player_data.get('gamertag_clean')}")
            error_count += 1
            success = False
        except IntegrityError as e:
            print(f"Database integrity error while processing player '{player_data.get('gamertag_clean')}': {str(e)}")
            error_count += 1
            success = False
        except KeyError as e:
            print(f"Missing required field in player data: {str(e)}")
            error_count += 1
            success = False
        except Exception as e:
            print(f"Unexpected error while processing player '{player_data.get('gamertag_clean')}': {str(e)}")
            error_count += 1
            success = False

    print("\nSummary:")
    print(f"- Players processed: {len(data)}")
    print(f"- New players created: {created_count}")
    print(f"- Existing players found: {existing_count}")
    print(f"- Errors encountered: {error_count}")

    return success


def main():
    """
    Main entry point for this script.
    """

    try:
        print('Starting team table setup...')
        player_result = create_teams(TEAM_DATA)
        if not player_result:
            print('\nTeam setup completed with errors - check logs above for details')
        else:
            print('\nTeam setup completed successfully')

        print('Starting player table setup...')
        team_result = create_players(PLAYER_DATA)
        if not team_result:
            print('\nPlayer setup completed with errors - check logs above for details')
        else:
            print('\nPlayer setup completed successfully')

    except Exception as e:
        print(f'\nScript failed with unexpected error: {str(e)}')
        return False

    print('Finished setup')


if __name__ == '__main__':
    main()