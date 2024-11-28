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

from general.models import GameMode

INITIAL_MODE_DATA = [
    {
        'code': 'hp',
        'name': 'Hardpoint'
    },
    {
        'code': 'snd',
        'name': 'Search And Destroy'
    },
    {
        'code': 'ctl',
        'name': 'Control'
    }
]


def create_initial_modes(data: List[dict]) -> bool:
    """
    Populate the general_gamemode table with the initial game mode set for the Black Ops 6 CDL season.

    Args:
         - data (List[dict]): The initial game mode set for the Black Ops 6 CDL season.

    Returns:
        - result (Bool): Whether all the modes were created successfully or not
    """
    success = True
    created_count = 0
    existing_count = 0
    error_count = 0

    print(f"\nAttempting to process {len(data)} game modes...")

    for mode_data in data:
        try:
            mode_obj, created = GameMode.objects.get_or_create(
                code=mode_data['code'],
                defaults={'name': mode_data['name']}
            )

            if created:
                print(f"Successfully created new game mode: {mode_obj.name} ({mode_obj.code})")
                created_count += 1
            else:
                print(f"Game mode already exists: {mode_obj.name} ({mode_obj.code})")
                existing_count += 1
        except IntegrityError as e:
            print(
                f"Database integrity error while processing mode '{mode_data.get('name')}' ({mode_data.get('code')}): {str(e)}")
            error_count += 1
            success = False
        except KeyError as e:
            print(f"Missing required field in mode data: {str(e)}")
            error_count += 1
            success = False
        except Exception as e:
            print(
                f"Unexpected error while processing mode '{mode_data.get('name')}' ({mode_data.get('code')}): {str(e)}")
            error_count += 1
            success = False

    print("\nSummary:")
    print(f"- Game modes processed: {len(data)}")
    print(f"- New modes created: {created_count}")
    print(f"- Existing modes found: {existing_count}")
    print(f"- Errors encountered: {error_count}")

    return success


def main():
    """
    Main entry point for this script.
    """
    print('Starting game mode table setup...')

    try:
        result = create_initial_modes(INITIAL_MODE_DATA)

        if not result:
            print('\nScript completed with errors - check logs above for details')
        else:
            print('\nScript completed successfully')

    except Exception as e:
        print(f'\nScript failed with unexpected error: {str(e)}')
        return False

    print('Finished game mode table setup')


if __name__ == '__main__':
    main()