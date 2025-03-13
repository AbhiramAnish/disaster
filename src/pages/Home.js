import React, { useEffect, useState } from "react";
import "./Home.css";
import axios from "axios";
import LocationScreen from "../Constants/Maps";

function Home() {
  const [weatherData, setWeatherData] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          "https://api.tomorrow.io/v4/weather/realtime",
          {
            params: {
              location: "kannur", // Change dynamically if needed
              apikey: "FvWrmQZWwEmpgFCd2BMyJVthCHMpW8rW",
            },
          }
        );

        const weather = response.data.data.values; // Extract weather data
        setWeatherData(weather);

        // Send weather data to Flask ML model
        getPrediction(weather);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError("Failed to fetch weather data.");
      }
    };

    fetchWeather();
  }, []);

  const getPrediction = async (weather) => {
    try {
      const response = await axios.post(
        "https://backend-1k0p.onrender.com/predict", // ✅ Correct Flask API URL
        {
          weather: [weather.temperature, weather.humidity, weather.windSpeed], // Adjust based on model input
        }
      );

      setPrediction(response.data.prediction);
    } catch (error) {
      console.error("Error getting prediction:", error);
      setError("Failed to get prediction.");
    }
  };

  return (
    <div className="Container">
      <h1>Weather-Based ML Prediction</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {weatherData ? (
        <div>
          <p><strong>Temperature:</strong> {weatherData.temperature}°C</p>
          <p><strong>Humidity:</strong> {weatherData.humidity}%</p>
          <p><strong>Wind Speed:</strong> {weatherData.windSpeed} km/h</p>
          <h2>Prediction: {prediction || "Loading..."}</h2>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}

      <LocationScreen />
    </div>
  );
}

export default Home;
