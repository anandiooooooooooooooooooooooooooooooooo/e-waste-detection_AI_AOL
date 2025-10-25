# backend/models/yolo/live_camera.py
import cv2
import time
import os
from ultralytics import YOLO

# Absolute path to your local YOLOv8 model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "yolov8n.pt")

if not os.path.exists(MODEL_PATH):
    print(f"Model not found at {MODEL_PATH}")
    exit()

# Load YOLOv8 model from local file
model = YOLO(MODEL_PATH)

# Open default camera (0)
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("Cannot open camera")
    exit()

prev_time = time.time()

while True:
    ret, frame = cap.read()
    if not ret:
        print("Failed to grab frame")
        break

    # Run YOLO detection on the frame
    results = model(frame)

    # Annotate frame
    annotated_frame = results[0].plot()  # results[0] contains detections

    # Calculate FPS
    curr_time = time.time()
    fps = 1 / (curr_time - prev_time)
    prev_time = curr_time
    cv2.putText(
        annotated_frame,
        f"FPS: {fps:.1f}",
        (10, 30),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 255, 0),
        2
    )

    # Show annotated frame
    cv2.imshow("YOLOv8 Live Detection", annotated_frame)

    # Exit on 'q' key
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release resources
cap.release()
cv2.destroyAllWindows()
