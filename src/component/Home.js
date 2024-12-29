import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

function Home() {
  return (
    <div className="home-page">
      <nav className="nav-bar">
        <button>
          <Link to="/weather">Weather Page</Link>
        </button>
        <button>
          <Link to="/stock">Stock Page</Link>
        </button>
      </nav>
    </div>
  );
}

export default Home;
