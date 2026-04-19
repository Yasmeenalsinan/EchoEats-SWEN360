import React, { useState, useEffect } from "react";
import "./App.css";

// ===== USER PROFILE PAGE =====
function UserProfilePage({ user, mealsRescued, moneySaved, co2Saved, onLogout, setCurrentPage }) {
  return (
    <div className="profile-page">
      <nav className="navbar">
        <div className="nav-left"><h1>🍽️ EchoEats</h1></div>
        <div className="nav-right">
          <button className="btn btn-logout" onClick={onLogout}>Logout</button>
        </div>
      </nav>
      <div className="profile-container">
        <button className="back-button" onClick={() => setCurrentPage("browseItems")}>← Back</button>
        <h2>Your Impact</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{mealsRescued}</div>
            <div className="stat-label">Meals Rescued</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">${moneySaved.toFixed(2)}</div>
            <div className="stat-label">Money Saved</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{co2Saved.toFixed(1)} kg</div>
            <div className="stat-label">CO2 Saved</div>
          </div>
        </div>
      </div>
    </div>
  );
}