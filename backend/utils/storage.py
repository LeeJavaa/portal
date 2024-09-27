import os
import logging

from django.conf import settings
from django.core.files.storage import default_storage

logger = logging.getLogger('gunicorn.error')

def get_file_paths(analysis):
    error_message = ""
    try:
        # Define subdirectories
        input_subdir = "input_gameplay"
        output_subdir = "output_gameplay"

        # Construct input file path
        input_filename = f"{analysis.input_file}.mp4"
        input_rel_path = os.path.join(input_subdir, input_filename)
        input_file_path = default_storage.path(input_rel_path)

        # Construct output file path
        output_filename = f"{analysis.output_file}.mp4"
        output_rel_path = os.path.join(output_subdir, output_filename)
        output_file_path = os.path.join(settings.MEDIA_ROOT, output_rel_path)

        return input_file_path, output_file_path, error_message
    except AttributeError as e:
        logger.error(f"Error getting file paths: {e}")
        error_message = "We ran into some issues dealing with the video files on your analysis."
        return None, None, error_message
    except FileNotFoundError as e:
        logger.error(f"Error getting file paths: {e}")
        error_message = "Sorry, we couldn't find the file that you need."
        return None, None, error_message
    except PermissionError as e:
        logger.error(f"Error getting file paths: {e}")
        error_message = "We seem to have a problem with our server's permissions! Who would have thought?"
        return None, None, error_message
    except Exception as e:
        logger.error(f"Error getting file paths: {e}")
        error_message = e
        return None, None, error_message