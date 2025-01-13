import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "100vh",
};

const defaultCenter = {
  lat: 37.78825, // Default latitude
  lng: -122.4324, // Default longitude
};

const LocationScreen = () => {
  const [location, setLocation] = useState(defaultCenter);
  const [loc, setLoc] = useState(true);

  // Load the Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyD23_rSb_haPqZpSW5fxUB1ygk8qm9yrjo", // Replace with your API key
  });

  // Get the user's current location
  const getCurrentLocation = () => {
    setLoc(false); // Turn off "turn on location" state
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching location:", error.message);
          alert("Unable to fetch location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <>
      {loc && alert("Turn on location services to view the map")}
      <GoogleMap mapContainerStyle={mapContainerStyle} zoom={15} center={location}>
        <Marker position={location} />
      </GoogleMap>
    </>
  );
};

export default LocationScreen;
