import cv2
import numpy as np
import time

from django.conf import settings

from utils.storage import get_file_paths

def process_video(analysis):
    input_file_path, output_file_path = get_file_paths(analysis)
    cap = cv2.VideoCapture(input_file_path)
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_file_path, fourcc, fps, settings.PROCESSED_DIMENSIONS)

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    start_time = time.time()
    last_log_time = start_time
    frames_processed = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        processed_frame = process_frame(frame)
        out.write(processed_frame)
        frames_processed += 1
        current_time = time.time()

        if current_time - last_log_time >= 20:
            seconds_processed = frames_processed / fps
            percentage_complete = (frames_processed / total_frames) * 100
            print(f"Processed {seconds_processed:.2f} seconds of video ({percentage_complete:.2f}% complete)")
            last_log_time = current_time
    
    cap.release()
    out.release()

    return True

def process_frame(frame):

    regions = ['minimap', 'killfeed', 'scorecard']
    new_frame = np.zeros(
        (settings.PROCESSED_DIMENSIONS[1], settings.PROCESSED_DIMENSIONS[0], 3), 
        dtype=np.uint8
    )

    for region in regions:
        region_x1 = settings.REGION_POS[region][0]
        region_x2 = settings.REGION_POS[region][1]
        region_y1 = settings.REGION_POS[region][2]
        region_y2 = settings.REGION_POS[region][3]

        region_area = frame[region_y1:region_y2, region_x1:region_x2]

        orig_height, orig_width = region_area.shape[:2]
        aspect_ratio = orig_width / orig_height
        new_width = settings.DESIRED_WIDTH[region]
        new_height = int(new_width / aspect_ratio)

        new_region_x1 = settings.DESIRED_POS[region][0]
        new_region_x2 = new_region_x1 + new_width
        new_region_y1 = settings.DESIRED_POS[region][1]
        new_region_y2 = new_region_y1 + new_height

        region_resized = cv2.resize(region_area, (new_width, new_height))

        new_frame[new_region_y1:new_region_y2, new_region_x1:new_region_x2] = region_resized
    
    return new_frame