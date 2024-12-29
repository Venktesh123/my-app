import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

function PageWithBackButton({ component }) {
  return (
    <div className="page-with-back">
      <div className="back-link">
        <Link to="/">← Back to Home</Link>
      </div>
      <div className="component-content">{component}</div>
    </div>
  );
}

export default PageWithBackButton;
