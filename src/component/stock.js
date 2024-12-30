import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import "./stockChart.css";

const StockChart = () => {
  const [stockData, setStockData] = useState([]);
  const [company, setCompany] = useState("IBM");
  const [companyInput, setCompanyInput] = useState("IBM");
  const [metaData, setMetaData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStockData();
  }, [company]);

  const fetchStockData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "https://weather-finance-track-bkyl.vercel.app/api/stock/data",
        {
          company,
        }
      );

      const { metaData, data } = response.data;

      if (metaData && data) {
        setMetaData(metaData);

        // Format stock data for the chart
        const formattedData = data.map((entry) => ({
          date: new Date(entry.date).toLocaleDateString(),
          price: parseFloat(entry.close),
        }));

        setStockData(formattedData);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setCompany(companyInput);
  };

  const chartOptions = {
    options: {
      chart: {
        type: "line",
        height: "100%",
        zoom: { enabled: true },
      },
      xaxis: {
        categories: stockData.map((item) => item.date),
        title: { text: "Date" },
      },
      yaxis: {
        title: { text: "Price (USD)" },
      },
      tooltip: {
        x: { format: "dd MMM yyyy" },
      },
      stroke: {
        curve: "smooth",
      },
      markers: {
        size: 4,
      },
    },
    series: [
      {
        name: "Stock Price",
        data: stockData.map((item) => item.price),
      },
    ],
  };

  return (
    <div className="stock-container">
      <h2 className="stock-title">
        Stock Prices for {metaData["2. Symbol"] || company}
      </h2>

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

      {loading && <p className="stock-loading">Loading stock data...</p>}
      {error && <p className="stock-error">{error}</p>}

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

      {!loading && !error && stockData.length > 0 && (
        <div className="stock-chart">
          <Chart
            options={chartOptions.options}
            series={chartOptions.series}
            type="line"
            height={400}
          />
        </div>
      )}
    </div>
  );
};

export default StockChart;
