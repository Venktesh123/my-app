import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import WeatherTable from "./component/weather";
import StockChart from "./component/stock";
import Home from "./component/Home";
import PageWithBackButton from "./component/PageWithButton";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/weather"
            element={<PageWithBackButton component={<WeatherTable />} />}
          />
          <Route
            path="/stock"
            element={<PageWithBackButton component={<StockChart />} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
