import React, { useState, useEffect } from "react";
import "./weather.css";

const WeatherTable = () => {
  const [location, setLocation] = useState("India"); // Default location
  const [weatherData, setWeatherData] = useState([]); // Data to display
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Function to fetch weather data
  const fetchWeatherData = async (location) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://localhost:5000/api/weather/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ location }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      if (result.success) {
        setWeatherData(result.data);
      } else {
        setError("No data found");
        setWeatherData([]);
      }
    } catch (error) {
      setError(error.message);
      setWeatherData([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle location input change
  const handleInputChange = (e) => {
    const newLocation = e.target.value;
    setLocation(newLocation);
    if (newLocation.trim()) {
      fetchWeatherData(newLocation);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchWeatherData(location);
  }, []);

  return (
    <div className="weather-container">
      <h1>Weather Data</h1>
      <input
        type="text"
        placeholder="Enter location"
        value={location}
        onChange={handleInputChange}
        className="location-input"
      />
      {loading && <p className="loading-text">Loading...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && weatherData.length > 0 && (
        <table className="weather-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Main</th>
              <th>Description</th>
              <th>Icon</th>
            </tr>
          </thead>
          <tbody>
            {weatherData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.main}</td>
                <td>{item.description}</td>
                <td>
                  <img
                    src={`http://openweathermap.org/img/wn/${item.icon}@2x.png`}
                    alt={item.description}
                    className="weather-icon"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WeatherTable;
