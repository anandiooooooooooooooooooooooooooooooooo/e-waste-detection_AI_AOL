from flask import Flask, request, jsonify
from flask_cors import CORS
import os, uuid, json
from ultralytics import YOLO

app = Flask(__name__, static_folder="static")
CORS(app)  # Allow cross-origin requests from React frontend

# Folders for uploads and results
UPLOAD_FOLDER = os.path.join(app.static_folder, "uploads")
RESULT_FILE = os.path.join(app.static_folder, "results", "latest_result.json")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(os.path.dirname(RESULT_FILE), exist_ok=True)

# Load YOLOv8 model
model_path = os.path.abspath("./models/yolo/yolov8n.pt")
if not os.path.exists(model_path):
    raise FileNotFoundError(f"YOLO model not found at {model_path}")
model = YOLO(model_path)

@app.route("/detect", methods=["POST"])
def detect():
    file = request.files.get("file")
    if not file or file.filename == "":
        return jsonify({"success": False, "error": "No file uploaded"}), 400

    # Save uploaded image
    filename = f"{uuid.uuid4().hex}.jpg"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    # Run YOLO detection
    results = model.predict(filepath)[0]  # returns a Results object
    detections = []
    for box, conf, cls in zip(results.boxes.xyxy, results.boxes.conf, results.boxes.cls):
        detections.append({
            "label": model.names[int(cls)],
            "confidence": float(conf),
            "box": [float(x) for x in box]  # [x1, y1, x2, y2]
        })

    # Save result data
    result_data = {
        "image_url": f"/static/uploads/{filename}",
        "detections": detections
    }
    with open(RESULT_FILE, "w") as f:
        json.dump(result_data, f)

    # Return JSON response so React can pass it to Loading / Result
    return jsonify({"success": True, "resultData": result_data})

@app.route("/api/result", methods=["GET"])
def get_result():
    if not os.path.exists(RESULT_FILE):
        return jsonify({"error": "No results yet"}), 404
    with open(RESULT_FILE, "r") as f:
        data = json.load(f)
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
