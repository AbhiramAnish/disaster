import React, { useEffect, useState } from "react";
import "./Home.css";
import axios from "axios";
import LocationScreen from "../Constants/Maps";

function Home() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [clickedWeather, setClickedWeather] = useState(null);
  const [currentPrediction, setCurrentPrediction] = useState({ flood: "", landslide: "" });
  const [clickedPrediction, setClickedPrediction] = useState({ flood: "", landslide: "" });
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [clickedLocation, setClickedLocation] = useState(null);

  useEffect(() => {
    if (clickedLocation && !currentLocation) {
      setCurrentLocation(clickedLocation);  
    }
  }, [clickedLocation]);

  useEffect(() => {
    if (currentLocation) {
      setClickedLocation(currentLocation);  // Set selected location to the current one at first
      fetchWeather(currentLocation, setCurrentWeather, setCurrentPrediction);
      fetchWeather(currentLocation, setClickedWeather, setClickedPrediction); // Fetch for selected location immediately
    }
  }, [currentLocation]);

  useEffect(() => {
    if (clickedLocation) {
      fetchWeather(clickedLocation, setClickedWeather, setClickedPrediction);
    }
  }, [clickedLocation]);

  const fetchWeather = async (location, setWeather, setPrediction) => {
    try {
      const apiKey = "FvWrmQZWwEmpgFCd2BMyJVthCHMpW8rW";
      if (!apiKey) throw new Error("Weather API key is missing!");

      const response = await axios.get("https://api.tomorrow.io/v4/weather/realtime", {
        params: {
          location: `${location.lat},${location.lng}`,
          apikey: apiKey,
        },
      });

      const weather = response.data.data.values;
      setWeather(weather);
      getPredictions(weather, setPrediction);
    } catch (error) {
      console.error("Error fetching weather:", error);
      setError("Failed to fetch weather data.");
    }
  };

  const getPredictions = async (weather, setPrediction) => {
    try {
      const response = await axios.post("http://localhost:5000/predict", {
        weather: [weather.temperature, weather.humidity, weather.windSpeed],
      });

      setPrediction({
        flood: response.data.prediction1,
        landslide: response.data.prediction2,
      });
    } catch (error) {
      console.error("Error getting predictions:", error);
      setError("Failed to get predictions.");
    }
  };

  const renderWeatherInfo = (weather, prediction, title) => (
    <div className="weather-section">
      <h2>{title}</h2>
      {weather ? (
        <div>
          <p><strong>Temperature:</strong> {weather.temperature}°C</p>
          <p><strong>Humidity:</strong> {weather.humidity}%</p>
          <p><strong>Wind Speed:</strong> {weather.windSpeed} km/h</p>
          <h3><strong>FLOOD:</strong> {prediction.flood === "1" ? "DANGER" : "SAFE"}</h3>
          <h3><strong>LANDSLIDE:</strong> {parseFloat(prediction.landslide) >= 0.9 ? "DANGER" : "SAFE"}</h3>
        </div>
      ) : <p>Loading weather data...</p>}
    </div>
  );

  return (
    <div className="Container">
      <h1>Weather-Based ML Prediction</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="weather-container">
  {renderWeatherInfo(currentWeather, currentPrediction, "Current Location")}
  {renderWeatherInfo(clickedWeather, clickedPrediction, "Selected Location")}
   </div>

      <LocationScreen setLocation={setClickedLocation} />
    </div>
  );
}

export default Home;
