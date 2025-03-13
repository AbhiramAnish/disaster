import React, { useEffect, useState } from "react";
import "./Home.css";
import axios from "axios";
import LocationScreen from "../Constants/Maps";
import twilio from "twilio"; // Import Twilio

function Home() {
  const [weatherData, setWeatherData] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [error, setError] = useState(null);

  // Twilio Credentials
  const accountSid = "AC93ad21169738fa74300621392c97a4ab";
  const authToken = "84c50fc79532115c93cef6982c96bad3";
  const client = twilio(accountSid, authToken);
  const numbers = ["+918547751321", "+919746458177"];

  // Function to Send SMS Alert
  const sendAlertSMS = async () => {
    try {
      console.log("Sending SMS alerts...");

      for (const number of numbers) {
        const message = await client.messages.create({
          messagingServiceSid: "MG75dfa40854e9bbb803e81503795cb3f6",
          body: "//website3",
          to: number,
        });

        console.log(`Message sent to ${number}: ${message.sid}`);
      }
    } catch (error) {
      console.error("Error sending SMS:", error);
    }
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          "https://api.tomorrow.io/v4/weather/realtime",
          {
            params: {
              location: "kannur",
              apikey: "FvWrmQZWwEmpgFCd2BMyJVthCHMpW8rW",
            },
          }
        );

        const weather = response.data.data.values;
        console.log(weather);
        setWeatherData(weather);
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
      const response = await axios.post("https://backend-1k0p.onrender.com/predict", {
        weather: [weather.temperature, weather.humidity, weather.windSpeed],
      });

      setPrediction(response.data.prediction);

      // If prediction is "1", send SMS alert
      if (response.data.prediction === "1") {
        sendAlertSMS();
      }
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

      <LocationScreen />
    </div>
  );
}

export default Home;
