import React, { useState } from "react";
import "./weather.css";

const WeatherTable = () => {
  const [location, setLocation] = useState("India");
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://weather-finance-track-bkyl.vercel.app/api/weather/data",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ location }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();

      if (result.success) {
        setWeatherData(result.data);
      } else {
        console.error("No data found");
        setWeatherData([]);
      }
    } catch (error) {
      console.error(error.message);
      setWeatherData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setLocation(e.target.value);
  };

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
      <button onClick={fetchWeatherData} className="fetch-button">
        Get Weather
      </button>
      {loading && <p className="loading-text">Loading...</p>}
      {!loading && weatherData.length > 0 && (
        <table className="weather-table">
          <thead>
            <tr>
              <th>Main</th>
              <th>Description</th>
              <th>Icon</th>
            </tr>
          </thead>
          <tbody>
            {weatherData.map((item) => (
              <tr key={item.id}>
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
