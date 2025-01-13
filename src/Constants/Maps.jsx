import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "100vh",
};

const defaultCenter = {
  lat: 37.78825, // Default position
  lng: -122.4324,
};

const EscapeLocation = {
  lat: 11.2588, // Kozhikode Latitude
  lng: 75.7804, // Kozhikode Longitude
};

const LocationScreen = () => {
  const [userLocation, setUserLocation] = useState(defaultCenter);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [isGomapsLoaded, setIsGomapsLoaded] = useState(false);

  // GoMaps API Key directly embedded
  const gomapsApiKey = "AlzaSyvZ7-oa0O3xC9sxU-GIxOB_0LeSq6wY9gN"; // Replace with your actual GoMaps API key

  const directionsUrl = `https://maps.gomaps.pro/maps/api/directions/json?origin=${userLocation.lat},${userLocation.lng}&destination=${EscapeLocation.lat},${EscapeLocation.lng}&key=${gomapsApiKey}`;

  const loadGomapsScript = () => {
    const script = document.createElement("script");
    script.src = `https://maps.gomaps.pro/maps/api/js?v=3.exp&libraries=places&key=${gomapsApiKey}`;
    script.onload = () => setIsGomapsLoaded(true);
    document.body.appendChild(script);
  };

  useEffect(() => {
    loadGomapsScript();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
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

  const fetchDirections = async () => {
    try {
      const response = await fetch(directionsUrl);
      const data = await response.json();

      if (data.routes && data.routes[0]) {
        setDirectionsResponse(data.routes[0]);
      } else {
        console.error("No route found!");
      }
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (userLocation.lat !== defaultCenter.lat && userLocation.lng !== defaultCenter.lng) {
      fetchDirections();
    }
  }, [userLocation]);

  const handleEscapeMarkerClick = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${EscapeLocation.lat},${EscapeLocation.lng}&travelmode=driving`;
    window.open(googleMapsUrl, "_blank");
  };

  if (!isGomapsLoaded) return <div>Loading Maps...</div>;

  return (
    <div style={mapContainerStyle}>
      <GoogleMap mapContainerStyle={mapContainerStyle} zoom={10} center={userLocation}>
        {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
        <Marker position={userLocation} />
        <Marker position={EscapeLocation} onClick={handleEscapeMarkerClick} />
      </GoogleMap>
    </div>
  );
};

export default LocationScreen;
