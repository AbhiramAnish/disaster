import React, { useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api"; // Removed DirectionsRenderer

const mapContainerStyle = {
  width: "100%",
  height: "100vh",
};

const defaultCenter = {
  lat: 37.78825, // Default position
  lng: -122.4324,
};

// Array of multiple escape locations with custom icons
const escapeLocations = [
  {
    name: "Kozhikode",
    lat: 11.2588,
    lng: 75.7804,
    icon: "https://maps.google.com/mapfiles/kml/paddle/grn-blank.png",
  },
  {
    name: "Ernakulam",
    lat: 9.9312,
    lng: 76.2673,
    icon: "https://maps.google.com/mapfiles/kml/paddle/grn-blank.png",
  },
  {
    name: "Thrissur",
    lat: 10.5276,
    lng: 76.2144,
    icon: "https://maps.google.com/mapfiles/kml/paddle/grn-blank.png",
  },
];

const LocationScreen = () => {
  const [userLocation, setUserLocation] = useState(defaultCenter);
  const [isGomapsLoaded, setIsGomapsLoaded] = useState(false);

  const gomapsApiKey = "AlzaSyYffcngulfi5Yup4OnB1fIsI-hT0TzZYrm"; // Replace with your actual GoMaps API key

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

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleEscapeMarkerClick = (lat, lng) => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${lat},${lng}&travelmode=driving`;
    window.open(googleMapsUrl, "_blank");
  };
  console.log("isGomapsLoaded:", isGomapsLoaded);
  if (!isGomapsLoaded) return <div>Loading Maps...</div>;

  return (
    <div style={mapContainerStyle}>
      <GoogleMap mapContainerStyle={mapContainerStyle} zoom={10} center={userLocation}>
        <Marker position={userLocation} label="You" />
        
        {escapeLocations.map((location, index) => (
          <Marker
          key={index}
          position={{ lat: location.lat, lng: location.lng }}
          icon={{
            url: location.icon, // Ensure this is a valid image URL
            scaledSize: new window.google.maps.Size(30, 30), // Set the size
          }}
          title={location.name}
          onClick={() => handleEscapeMarkerClick(location.lat, location.lng)}
        />        
        ))}
      </GoogleMap>
    </div>
  );
};

export default LocationScreen;
