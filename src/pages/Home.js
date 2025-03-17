import React, { useEffect, useState } from "react";
import "./Home.css";
import axios from "axios";
import LocationScreen from "../Constants/Maps";

function Home() {
  const [weatherData, setWeatherData] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({ lat: 11.8745, lng: 75.3704 }); // Default to Kannur

  useEffect(() => {
    fetchWeather(location);
  }, [location]); // 🔥 Fetch weather whenever location updates

  const fetchWeather = async (loc) => {
    try {
      const response = await axios.get(
        "https://api.tomorrow.io/v4/weather/realtime",
        {
          params: {
            location: `${loc.lat},${loc.lng}`, 
            apikey: "FvWrmQZWwEmpgFCd2BMyJVthCHMpW8rW", 
          },
        }
      );

      const weather = response.data.data.values;
      console.log("Weather Data:", weather);
      setWeatherData(weather);

      getPrediction(weather);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("Failed to fetch weather data.");
    }
  };

  const getPrediction = async (weather) => {
    try {
      const response = await axios.post(
        "https://backend-1k0p.onrender.com/predict",
        {
          weather: [weather.temperature, weather.humidity, weather.windSpeed], // Adjust for your ML model
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
          <h2>
            Current Situation:{" "}
            {prediction === "1" ? (
              <span style={{ color: "red", fontWeight: "bold" }}>DANGER</span>
            ) : prediction === "0" ? (
              <span style={{ color: "green", fontWeight: "bold" }}>SAFE</span>
            ) : (
              "Loading..."
            )}
          </h2>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}

      {/* Pass setLocation to update weather when map is clicked */}
      <LocationScreen setLocation={setLocation} />
    </div>
  );
}

export default Home;