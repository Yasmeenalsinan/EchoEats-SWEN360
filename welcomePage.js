import React, { useState, useEffect } from "react";
import "./App.css";

// ===== WELCOME PAGE =====
function WelcomePage({ setCurrentPage }) {
  return (
    <div className="welcome-page">
      <div className="welcome-container">
        <div className="welcome-header">
          <h1 className="logo">🍽️</h1>
          <h2>EchoEats</h2>
          <p>Reduce Food Waste. Save Money.</p>
        </div>
        <div className="benefits">
          <div className="benefit-item">
            <span className="benefit-icon">📉</span>
            <span>Dynamic prices decrease as expiration approaches</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">💰</span>
            <span>Save money while fighting food waste</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">🌱</span>
            <span>Reduce your environmental impact with every meal</span>
          </div>
        </div>
        <div className="welcome-actions">
          <button className="btn btn-primary btn-large" onClick={() => setCurrentPage("login")}>Log In</button>
          <button className="btn btn-secondary btn-large" onClick={() => setCurrentPage("signup")}>Sign Up</button>
        </div>
      </div>
    </div>
  );
}

