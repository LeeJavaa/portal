import cv2
import numpy as np
import time

REGION_POS = {
    'minimap' : [28, 600, 744, 1058],
    'killfeed' : [22, 386, 468, 714],
    'scorecard' : [714, 1202, 12, 202]
}

DESIRED_POS = {
    'minimap': [0, 321],
    'killfeed': [0, 12],
    'scorecard': [510, 12]
}

DESIRED_WIDTH = {
    'minimap': 1340,
    'killfeed': 506,
    'scorecard': 774
}

def process_frame(frame):

    regions = ['minimap', 'killfeed', 'scorecard']
    new_frame = np.zeros((1080, 1340, 3), dtype=np.uint8)

    for region in regions:
        region_x1 = REGION_POS[region][0]
        region_x2 = REGION_POS[region][1]
        region_y1 = REGION_POS[region][2]
        region_y2 = REGION_POS[region][3]

        region_area = frame[region_y1:region_y2, region_x1:region_x2]

        orig_height, orig_width = region_area.shape[:2]
        aspect_ratio = orig_width / orig_height
        new_width = DESIRED_WIDTH[region]
        new_height = int(new_width / aspect_ratio)

        new_region_x1 = DESIRED_POS[region][0]
        new_region_x2 = new_region_x1 + new_width
        new_region_y1 = DESIRED_POS[region][1]
        new_region_y2 = new_region_y1 + new_height

        region_resized = cv2.resize(region_area, (new_width, new_height))

        new_frame[new_region_y1:new_region_y2, new_region_x1:new_region_x2] = region_resized
    
    return new_frame

def process_video(input_path, output_path):
    cap = cv2.VideoCapture(input_path)

    fps = int(cap.get(cv2.CAP_PROP_FPS))

    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (1340, 1080))

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
        elapsed_time = current_time - start_time

        if current_time - last_log_time >= 20:
            seconds_processed = frames_processed / fps
            percentage_complete = (frames_processed / total_frames) * 100
            print(f"Processed {seconds_processed:.2f} seconds of video ({percentage_complete:.2f}% complete)")
            last_log_time = current_time
    
    cap.release()
    out.release()

def run():
    input_video_path = './gameplay.mp4'
    output_video_path = './processed_gameplay.mp4'
    process_video(input_video_path, output_video_path)

if __name__ == '__main__':
    run()