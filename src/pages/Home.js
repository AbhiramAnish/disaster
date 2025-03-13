import React, { useEffect, useState } from "react";
import "./Home.css";
import axios from "axios";
import LocationScreen from "../Constants/Maps";

function Home() {
  const [weatherData, setWeatherData] = useState(null);
  const [prediction, setPrediction] = useState("");

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

        // Send this weather data to Flask ML model
        getPrediction(weather);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeather();
  }, []);

  const getPrediction = async (weather) => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", {
        weather: [weather.temperature, weather.humidity, weather.windSpeed], // Adjust based on model input
      });

      setPrediction(response.data.prediction);
    } catch (error) {
      console.error("Error getting prediction:", error);
    }
  };

  return (
    <div className="Container">
      <h1>Weather-Based ML Prediction</h1>
      {weatherData && (
        <div>
          <p>Temperature: {weatherData.temperature}°C</p>
          <p>Humidity: {weatherData.humidity}%</p>
          <p>Wind Speed: {weatherData.windSpeed} km/h</p>
          <h2>Prediction: {prediction}</h2>
        </div>
      )}
      <LocationScreen />
    </div>
  );
}

export default Home;
