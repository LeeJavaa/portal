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
from general.models import Player, Team

INITIAL_PLAYER_DATA = [
    {
        'full_name': 'Anthony Cuevas-Castro',
        'gamertag_clean': 'Shotzzy',
        'gamertag_dirty': 'Shotzzy',
        'team': 'ot'
    },
    {
        'full_name': 'Amer Zulbeari',
        'gamertag_clean': 'Pred',
        'gamertag_dirty': 'Pred',
        'team': 'ot'
    },
    {
        'full_name': 'Kenneth Williams',
        'gamertag_clean': 'Kenny',
        'gamertag_dirty': 'Kenny',
        'team': 'ot'
    },
    {
        'full_name': 'Brandon Otell',
        'gamertag_clean': 'Dashy',
        'gamertag_dirty': 'Dashy',
        'team': 'ot'
    },
    {
        'full_name': 'Amer Zulbeari',
        'gamertag_clean': 'Pred',
        'gamertag_dirty': 'Pred',
        'team': 'ot'
    },
    {
        'full_name': 'Dillon Price',
        'gamertag_clean': 'Attach',
        'gamertag_dirty': 'Attach',
        'team': 'c9'
    },
    {
        'full_name': 'Kyle Haworth',
        'gamertag_clean': 'Kremp',
        'gamertag_dirty': 'Kremp',
        'team': 'c9'
    },
    {
        'full_name': 'Makenzie Kelley',
        'gamertag_clean': 'Mack',
        'gamertag_dirty': 'Mack',
        'team': 'c9'
    },
    {
        'full_name': 'Daunte Gray',
        'gamertag_clean': 'Sib',
        'gamertag_dirty': 'Sib',
        'team': 'c9'
    },
    {
        'full_name': 'Tyler Pharris',
        'gamertag_clean': 'Abezy',
        'gamertag_dirty': 'AbeZy',
        'team': 'af'
    },
    {
        'full_name': 'McArthur Jovel',
        'gamertag_clean': 'Cellium',
        'gamertag_dirty': 'Cellium',
        'team': 'af'
    },
    {
        'full_name': 'Zachary Jordan',
        'gamertag_clean': 'Drazah',
        'gamertag_dirty': 'Drazah',
        'team': 'af'
    },
    {
        'full_name': 'Chris Lehr',
        'gamertag_clean': 'Simp',
        'gamertag_dirty': 'Simp',
        'team': 'af'
    },
    {
        'full_name': 'Cameron McKilligan',
        'gamertag_clean': 'Cammy',
        'gamertag_dirty': 'Cammy',
        'team': 'bb'
    },
    {
        'full_name': 'Joseph Conley',
        'gamertag_clean': 'Owakening',
        'gamertag_dirty': 'Owakening',
        'team': 'bb'
    },
    {
        'full_name': 'Evan Perez',
        'gamertag_clean': 'Purj',
        'gamertag_dirty': 'Purj',
        'team': 'bb'
    },
    {
        'full_name': 'Eric Lozano',
        'gamertag_clean': 'Snoopy',
        'gamertag_dirty': 'Snoopy',
        'team': 'bb'
    },
    {
        'full_name': 'Isaiah Gwinn',
        'gamertag_clean': 'Gwinn',
        'gamertag_dirty': 'Gwinn',
        'team': 'crr'
    },
    {
        'full_name': 'Austin Liddicoat',
        'gamertag_clean': 'Slasher',
        'gamertag_dirty': 'Slasher',
        'team': 'crr'
    },
    {
        'full_name': 'Thomas Haly',
        'gamertag_clean': 'TJHaly',
        'gamertag_dirty': 'TJHaly',
        'team': 'crr'
    },
    {
        'full_name': 'Reece Drost',
        'gamertag_clean': 'Vivid',
        'gamertag_dirty': 'Vivid',
        'team': 'crr'
    },
    {
        'full_name': 'Ben McMellon',
        'gamertag_clean': 'Beans',
        'gamertag_dirty': 'Beans',
        'team': 'tu'
    },
    {
        'full_name': 'Tobias Juul Jonsson',
        'gamertag_clean': 'CleanX',
        'gamertag_dirty': 'CleanX',
        'team': 'tu'
    },
    {
        'full_name': 'Jamie Craven',
        'gamertag_clean': 'Insight',
        'gamertag_dirty': 'Insight',
        'team': 'tu'
    },
    {
        'full_name': 'Joseph Romero',
        'gamertag_clean': 'JoeDeceives',
        'gamertag_dirty': 'JoeDeceives',
        'team': 'tu'
    },
    {
        'full_name': 'Saud Alati',
        'gamertag_clean': 'Exnid',
        'gamertag_dirty': 'Exnid',
        'team': 'vf'
    },
    {
        'full_name': 'Khaid Almadhi',
        'gamertag_clean': 'Khhx',
        'gamertag_dirty': 'Khhx',
        'team': 'vf'
    },
    {
        'full_name': 'Abdulelah Alrajhi',
        'gamertag_clean': 'Kingabody',
        'gamertag_dirty': 'Kingabody',
        'team': 'vf'
    },
    {
        'full_name': 'Salman Alhuzayyim',
        'gamertag_clean': 'Roxas',
        'gamertag_dirty': 'Roxas',
        'team': 'vf'
    },
    {
        'full_name': 'Matthew Tinsley',
        'gamertag_clean': 'Kismet',
        'gamertag_dirty': 'KiSMET',
        'team': 'lag'
    },
    {
        'full_name': 'Thomas Gregorio',
        'gamertag_clean': 'Lyynnz',
        'gamertag_dirty': 'Lyynnz',
        'team': 'lag'
    },
    {
        'full_name': 'Preston Greiner',
        'gamertag_clean': 'Priestahh',
        'gamertag_dirty': 'Priestahh',
        'team': 'lag'
    },
    {
        'full_name': 'Cesar Bueno',
        'gamertag_clean': 'Skyz',
        'gamertag_dirty': 'Skyz',
        'team': 'lag'
    },
    {
        'full_name': 'Dylan Hannon',
        'gamertag_clean': 'Envoy',
        'gamertag_dirty': 'Envoy',
        'team': 'lat'
    },
    {
        'full_name': 'Daniel Rothe',
        'gamertag_clean': 'Ghosty',
        'gamertag_dirty': 'Ghosty',
        'team': 'lat'
    },
    {
        'full_name': 'Paco Rusiewiez',
        'gamertag_clean': 'HyDra',
        'gamertag_dirty': 'HyDra',
        'team': 'lat'
    },
    {
        'full_name': 'Thomas Ernst',
        'gamertag_clean': 'Scrap',
        'gamertag_dirty': 'Scrap',
        'team': 'lat'
    },
    {
        'full_name': 'Alejandro Lopez',
        'gamertag_clean': 'Lucky',
        'gamertag_dirty': 'Lucky',
        'team': 'mh'
    },
    {
        'full_name': 'Adrian Serrano',
        'gamertag_clean': 'Mettalz',
        'gamertag_dirty': 'MettalZ',
        'team': 'mh'
    },
    {
        'full_name': 'Jose Castilla',
        'gamertag_clean': 'Reeal',
        'gamertag_dirty': 'ReeaL',
        'team': 'mh'
    },
    {
        'full_name': 'David Isern',
        'gamertag_clean': 'Renkor',
        'gamertag_dirty': 'RenKoR',
        'team': 'mh'
    },
    {
        'full_name': 'Javier Milagro',
        'gamertag_clean': 'Vikul',
        'gamertag_dirty': 'Vikul',
        'team': 'mh'
    },
    {
        'full_name': 'Justice McMillan',
        'gamertag_clean': 'Estreal',
        'gamertag_dirty': 'Estreal',
        'team': 'mr'
    },
    {
        'full_name': 'Giovanni Webster',
        'gamertag_clean': 'Gio',
        'gamertag_dirty': 'Gio',
        'team': 'mr'
    },
    {
        'full_name': 'Dylan Koch',
        'gamertag_clean': 'Nero',
        'gamertag_dirty': 'Nero',
        'team': 'mr'
    },
    {
        'full_name': 'Paul Avila',
        'gamertag_clean': 'PaulEhx',
        'gamertag_dirty': 'PaulEhx',
        'team': 'mr'
    },
    {
        'full_name': 'Jovan Rodriguez',
        'gamertag_clean': '04',
        'gamertag_dirty': '04',
        'team': 'vs'
    },
    {
        'full_name': 'Jordan Francois',
        'gamertag_clean': 'Abuzah',
        'gamertag_dirty': 'Abuzah',
        'team': 'vs'
    },
    {
        'full_name': 'Charlie Hicks',
        'gamertag_clean': 'Hicksy',
        'gamertag_dirty': 'Hicksy',
        'team': 'vs'
    },
    {
        'full_name': 'Byron Plumridge',
        'gamertag_clean': 'Nastie',
        'gamertag_dirty': 'Nastie',
        'team': 'vs'
    },
]

def create_initial_players(data: List[dict]) -> bool:
    """
    Populate the general_player table with the initial player set for the Black Ops 6 CDL season.

    Args:
         - data (List[dict]): The initial player set for the Black Ops 6 CDL season.

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
    print('Starting player table setup...')

    try:
        result = create_initial_players(INITIAL_PLAYER_DATA)

        if not result:
            print('\nScript completed with errors - check logs above for details')
        else:
            print('\nScript completed successfully')

    except Exception as e:
        print(f'\nScript failed with unexpected error: {str(e)}')
        return False

    print('Finished player table setup')
    return result


if __name__ == '__main__':
    main()