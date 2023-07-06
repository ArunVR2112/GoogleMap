import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const Map = () => {
  const [map, setMap] = useState(null);
  const [customerData, setCustomerData] = useState({
    name: "",
    phoneNumber: "",
    latitude: 0,
    longitude: 0,
  });
  const [customerLocations, setCustomerLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [path, setPath] = useState([]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          if (tracking && customerData.latitude !== 0 && customerData.longitude !== 0) {
            setPath([
              { lat: latitude, lng: longitude },
              {
                lat: customerData.latitude,
                lng: customerData.longitude,
              },
            ]);
          }
        },
        (error) => {
          console.log("Error getting the driver's location:", error);
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, [tracking, customerData]);

  const handleMapLoad = (map) => {
    setMap(map);
  };

  const handleAddCustomer = () => {
    const { name, phoneNumber, latitude, longitude } = customerData;
    const newCustomer = {
      name,
      phoneNumber,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };
    setCustomerLocations([...customerLocations, newCustomer]);
    setCustomerData({
      name: "",
      phoneNumber: "",
      latitude: 0,
      longitude: 0,
    });
    setPath([]);
  };

  const startTracking = () => {
    setTracking(true);
  };

  const stopTracking = () => {
    setTracking(false);
  };

  if (!isLoaded) {
    return <div>Loading maps...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.mapContainer}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          zoom={10}
          center={
            currentLocation
              ? { lat: currentLocation.lat, lng: currentLocation.lng }
              : { lat: customerData.latitude, lng: customerData.longitude }
          }
          onLoad={handleMapLoad}
          onClick={(e) => {
            const { latLng } = e;
            const lat = latLng.lat();
            const lng = latLng.lng();
            setCustomerData({ ...customerData, latitude: lat, longitude: lng });
          }}
        >
          {currentLocation && (
            <Marker
              position={{ lat: currentLocation.lat, lng: currentLocation.lng }}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                scaledSize: new window.google.maps.Size(32, 32),
              }}
            />
          )}

          {customerLocations.map((customer, index) => (
            <Marker
              key={index}
              position={{ lat: customer.latitude, lng: customer.longitude }}
            />
          ))}

          {/* Add Marker for Driver's Location */}
          {currentLocation && (
            <Marker
              position={{ lat: currentLocation.lat, lng: currentLocation.lng }}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                scaledSize: new window.google.maps.Size(32, 32),
              }}
            />
          )}

          {path.length > 0 && (
            <Polyline
              path={path}
              options={{
                strokeColor: "#0000FF",
                strokeOpacity: 0.8,
                strokeWeight: 2,
              }}
            />
          )}
        </GoogleMap>
      </div>

      <div style={styles.sidePanel}>
        <div style={styles.addCustomerContainer}>
          <h3>Add Customer</h3>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={customerData.name}
              onChange={(e) =>
                setCustomerData({ ...customerData, name: e.target.value })
              }
              style={styles.input}
            />
          </div>
          <div>
            <label>Phone Number:</label>
            <input
              type="text"
              value={customerData.phoneNumber}
              onChange={(e) =>
                setCustomerData({ ...customerData, phoneNumber: e.target.value })
              }
              style={styles.input}
            />
          </div>
          <div>
            <label>Latitude:</label>
            <input
              type="text"
              value={customerData.latitude}
              onChange={(e) =>
                setCustomerData({ ...customerData, latitude: e.target.value })
              }
              style={styles.input}
            />
          </div>
          <div>
            <label>Longitude:</label>
            <input
              type="text"
              value={customerData.longitude}
              onChange={(e) =>
                setCustomerData({ ...customerData, longitude: e.target.value })
              }
              style={styles.input}
            />
          </div>
          <button onClick={handleAddCustomer} style={styles.button}>
            Add Customer
          </button>
        </div>

        <div style={styles.trackingButtonContainer}>
          {tracking ? (
            <button onClick={stopTracking} style={styles.button}>
              Stop Tracking
            </button>
          ) : (
            <button onClick={startTracking} style={styles.button}>
              Start Tracking
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
  },
  mapContainer: {
    flex: 1,
  },
  sidePanel: {
    width: "400px",
    backgroundColor: "#f8f8f8",
    padding: "20px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  addCustomerContainer: {
    marginBottom: "20px",
  },
  trackingButtonContainer: {
    marginBottom: "20px",
  },
  input: {
    margin: "5px 0",
    padding: "5px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "100%",
    
  },
  button: {
    margin: "5px 0",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#4caf50",
    color: "white",
    cursor: "pointer",
    width: "100%",
  },
};

export default Map;