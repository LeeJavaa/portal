import os
import sys
from pathlib import Path
from typing import List

import django
from django.db import IntegrityError

# This is to run Django in a standalone configuration
project_path = Path(__file__).resolve().parent
sys.path.append(str(project_path))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from general.models import Team


INITIAL_TEAM_DATA = [
    {
        'code': 'af',
        'name': 'Atlanta FaZe'
    },
    {
        'code': 'bb',
        'name': 'Boston Breach'
    },
    {
        'code': 'crr',
        'name': 'Carolina Royal Ravens'
    },
    {
        'code': 'c9',
        'name': 'Cloud9 New York'
    },
    {
        'code': 'lag',
        'name': 'Los Angeles Guerrillas'
    },
    {
        'code': 'lat',
        'name': 'Los Angeles Thieves'
    },
    {
        'code': 'mh',
        'name': 'Miami Heretics'
    },
    {
        'code': 'mr',
        'name': 'Minnesota Rokkr'
    },
    {
        'code': 'ot',
        'name': 'OpTic Texas'
    },
    {
        'code': 'vs',
        'name': 'Vancouver Surge'
    },
    {
        'code': 'tu',
        'name': 'Toronto Ultra'
    },
    {
        'code': 'vf',
        'name': 'Vegas Falcons'
    },
]


def create_initial_teams(data: List[dict]) -> bool:
    """
    Populate the general_team table with the initial team set for the Black Ops 6 CDL season.

    Args:
         - data (List[dict]): The initial team set for the Black Ops 6 CDL season.

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


def main():
    """
    Main entry point for this script.
    """
    print('Starting team table setup...')

    try:
        result = create_initial_teams(INITIAL_TEAM_DATA)

        if not result:
            print('\nScript completed with errors - check logs above for details')
        else:
            print('\nScript completed successfully')

    except Exception as e:
        print(f'\nScript failed with unexpected error: {str(e)}')
        return False

    print('Finished team table setup')


if __name__ == '__main__':
    main()