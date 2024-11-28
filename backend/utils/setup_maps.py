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

from general.models import Map

INITIAL_MAP_DATA = [
    {
        'name': 'protocol'
    },
    {
        'name': 'redcard'
    },
    {
        'name': 'rewind'
    },
    {
        'name': 'skyline'
    },
    {
        'name': 'vault'
    }
]

def create_initial_maps(data: List[dict]) -> bool:
    """
    Populate the general_maps table with the initial map set for the Black Ops 6 CDL season.

    Args:
         - data (List[dict]): The initial map set for the Black Ops 6 CDL season.

    Returns:
        - result (Bool): Whether all the maps were created successfully or not
    """
    success = True
    created_count = 0
    existing_count = 0
    error_count = 0

    print(f"\nAttempting to process {len(data)} maps...")

    for map_data in data:
        try:
            map_obj, created = Map.objects.get_or_create(
                name=map_data['name']
            )

            if created:
                print(f"Successfully created new map: {map_obj.name}")
                created_count += 1
            else:
                print(f"Map already exists: {map_obj.name}")
                existing_count += 1
        except IntegrityError as e:
            print(f"Database integrity error while processing map '{map_data.get('name')}': {str(e)}")
            error_count += 1
            success = False
        except KeyError as e:
            print(f"Missing required field in map data: {str(e)}")
            error_count += 1
            success = False
        except Exception as e:
            print(f"Unexpected error while processing map '{map_data.get('name')}': {str(e)}")
            error_count += 1
            success = False

    print("\nSummary:")
    print(f"- Maps processed: {len(data)}")
    print(f"- New maps created: {created_count}")
    print(f"- Existing maps found: {existing_count}")
    print(f"- Errors encountered: {error_count}")

    return success

def main():
    """
    Main entry point for this script.
    """
    print('Starting map table setup...')

    try:
        result = create_initial_maps(INITIAL_MAP_DATA)

        if not result:
            print('\nScript completed with errors - check logs above for details')
        else:
            print('\nScript completed successfully')

    except Exception as e:
        print(f'\nScript failed with unexpected error: {str(e)}')
        return False

    print('Finished map table setup')

if __name__ == '__main__':
    main()