import os

from django.conf import settings
from django.core.files.storage import default_storage

def get_file_paths(analysis):
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
    
    os.makedirs(os.path.dirname(input_file_path), exist_ok=True)
    os.makedirs(os.path.dirname(output_file_path), exist_ok=True)

    return input_file_path, output_file_path