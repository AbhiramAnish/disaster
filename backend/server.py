from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import pickle
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the ML model
model = pickle.load(open("random_forest_model.pkl", "rb"))

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json  # Get data from frontend
    weather_features = np.array(data["weather"]).reshape(1, -1)  # Convert to NumPy array
    prediction = model.predict(weather_features)[0]  # Predict using ML model
    return jsonify({"prediction": str(prediction)})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)  # Allow external connections
