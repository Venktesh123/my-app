import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import "./stockChart.css";

const StockChart = () => {
  const [stockData, setStockData] = useState([]); // For chart data
  const [company, setCompany] = useState("IBM"); // Default company name
  const [companyInput, setCompanyInput] = useState("IBM"); // Default input for user changes
  const [metaData, setMetaData] = useState({}); // MetaData for the selected stock
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error handling

  // Fetch stock data when the component mounts or company changes
  useEffect(() => {
    fetchStockData();
  }, [company]);

  const fetchStockData = async () => {
    setLoading(true);
    setError(""); // Reset error on new fetch
    try {
      const response = await axios.post(
        "http://localhost:5000/api/stock/data",
        {
          company, // Send the company symbol in the request body
        }
      );

      const { metaData, data } = response.data; // Access metaData and data from the response

      if (metaData && data) {
        setMetaData(metaData);

        // Format stock data for the chart
        const formattedData = data.map((entry) => ({
          date: new Date(entry.date).toLocaleDateString(), // Convert date to readable format
          price: parseFloat(entry.close), // Use the closing price
        }));

        setStockData(formattedData); // Update state with formatted data
      } else {
        throw new Error("Invalid response structure from API");
      }
    } catch (error) {
      setError("Unable to fetch stock data. Please try again.");
      console.error("Error fetching stock data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission for company search
  const handleSubmit = (e) => {
    e.preventDefault();
    setCompany(companyInput); // Update the company for API fetch
  };

  return (
    <div className="stock-container">
      <h2 className="stock-title">
        Stock Prices for {metaData["2. Symbol"] || company}
      </h2>

      {/* Input field for company search */}
      <form onSubmit={handleSubmit} className="stock-form">
        <input
          type="text"
          value={companyInput}
          onChange={(e) => setCompanyInput(e.target.value)}
          placeholder="Enter Company Symbol (e.g., IBM)"
          className="stock-input"
        />
        <button type="submit" className="stock-button">
          Get Stock Data
        </button>
      </form>

      {/* Loading State */}
      {loading && <p className="stock-loading">Loading stock data...</p>}

      {/* Error Message */}
      {error && <p className="stock-error">{error}</p>}

      {/* Stock Meta Data */}
      {!loading && !error && metaData && (
        <div className="stock-meta">
          <p>
            <strong>Information:</strong> {metaData["1. Information"]}
          </p>
          <p>
            <strong>Last Refreshed:</strong> {metaData["3. Last Refreshed"]}
          </p>
          <p>
            <strong>Time Zone:</strong> {metaData["5. Time Zone"]}
          </p>
        </div>
      )}

      {/* Stock Chart */}
      {!loading && !error && stockData.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={stockData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default StockChart;
