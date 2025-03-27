import React, { useEffect, useState } from "react";
import "./Home.css";
import axios from "axios";
import LocationScreen from "../Constants/Maps";

function Home() {
  const [weatherData, setWeatherData] = useState(null);
  const [prediction1, setPrediction1] = useState("");
  const [prediction2, setPrediction2] = useState("");
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({ lat: 11.8745, lng: 75.3704 }); // Default: Kannur

  useEffect(() => {
    if (location) fetchWeather(location);
  }, [location]); // Fetch weather when location updates

  const fetchWeather = async (loc) => {
    try {
      const apiKey = "FvWrmQZWwEmpgFCd2BMyJVthCHMpW8rW"
      if (!apiKey) throw new Error("Weather API key is missing!");

      const response = await axios.get("https://api.tomorrow.io/v4/weather/realtime", {
        params: {
          location: `${loc.lat},${loc.lng}`,
          apikey: apiKey,
        },
      });

      const weather = response.data.data.values;
      console.log("Weather Data:", weather);
      setWeatherData(weather);

      if (weather.temperature && weather.humidity && weather.windSpeed) {
        getPredictions(weather);
      } else {
        setError("Incomplete weather data received.");
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
      setError(error.response?.data?.message || "Failed to fetch weather data.");
    }
  };

  const getPredictions = async (weather) => {
    try {
      const response = await axios.post("https://backend-1k0p.onrender.com/predict", {
        weather: [weather.temperature, weather.humidity, weather.windSpeed],
      });

      setPrediction1(response.data.prediction1);
      setPrediction2(response.data.prediction2);
    } catch (error) {
      console.error("Error getting predictions:", error);
      setError(error.response?.data?.message || "Failed to get predictions.");
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
            <strong>Model 1 Prediction:</strong>{" "}
            {prediction1 === "1" ? (
              <span style={{ color: "red", fontWeight: "bold" }}>DANGER</span>
            ) : prediction1 === "0" ? (
              <span style={{ color: "green", fontWeight: "bold" }}>SAFE</span>
            ) : (
              "Loading..."
            )}
          </h2>

          <h2>
            <strong>Model 2 Prediction:</strong>{" "}
            {prediction2 >= "0.9" ? (
              <span style={{ color: "red", fontWeight: "bold" }}>DANGER</span>
            ) : prediction2 <= "0.9" ? (
              <span style={{ color: "green", fontWeight: "bold" }}>SAFE</span>
            ) : (
              "Loading..."
            )}
          </h2>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}

      <LocationScreen setLocation={setLocation} />
    </div>
  );
}

export default Home;
