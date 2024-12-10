import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapComponent = () => {
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [accuracy, setAccuracy] = useState(null); // State to track accuracy
  const [error, setError] = useState(null); // State to track geolocation errors

  useEffect(() => {
    const options = {
      enableHighAccuracy: true,
      timeout: 10000, // Increased timeout for better accuracy
      maximumAge: 5000, // Accept cached positions up to 5 seconds old
    };

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lati = pos.coords.latitude;
        const longi = pos.coords.longitude;
        const posAccuracy = pos.coords.accuracy;

        // Only update the location if accuracy is below 50 meters (you can adjust this threshold)
        if (posAccuracy <= 50) {
          setLocation({ lat: lati, lng: longi });
          setAccuracy(posAccuracy);
          setError(null); // Reset error state on successful location update
        }
      },
      (err) => {
        if (err.code === 1) {
          setError('Location permission denied. Please allow location access.');
        } else if (err.code === 2) {
          setError('Position unavailable. Please check your network or device settings.');
        } else if (err.code === 3) {
          setError('Location request timed out. Try again.');
        } else {
          setError('An unknown error occurred while fetching location.');
        }
      },
      options
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const mapStyles = {
    height: '400px',
    width: '100%',
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={mapStyles} zoom={15} center={location}>
        <Marker position={location} />
      </GoogleMap>
      {accuracy && <p>Accuracy: {accuracy.toFixed(2)} meters</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </LoadScript>
  );
};

export default MapComponent;
