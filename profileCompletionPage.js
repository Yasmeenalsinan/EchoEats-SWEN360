import React, { useState, useEffect } from "react";
import "./App.css";

// ===== PROFILE COMPLETION PAGE =====
function ProfileCompletionPage({ setCurrentPage, setUser, user, users, setUsers, userPreferences, setUserPreferences }) {
  return (
    <div className="profile-completion-page">
      <div className="profile-container">
        <h2>Complete Your Profile</h2>
        <div className="profile-section">
          <h3>Dietary Preferences</h3>
          <div className="dietary-badges">
            {["Vegetarian", "Vegan", "Gluten-Free"].map(diet => (
              <button
                key={diet}
                className={`dietary-badge ${userPreferences.dietary.includes(diet) ? "active" : ""}`}
                onClick={() => {
                  if (userPreferences.dietary.includes(diet)) {
                    setUserPreferences({
                      ...userPreferences,
                      dietary: userPreferences.dietary.filter(d => d !== diet)
                    });
                  } else {
                    setUserPreferences({
                      ...userPreferences,
                      dietary: [...userPreferences.dietary, diet]
                    });
                  }
                }}
              >
                {diet}
              </button>
            ))}
          </div>
        </div>
        <button className="btn btn-primary btn-large" onClick={() => setCurrentPage(user?.role === "vendor" ? "dashboard" : "browseItems")}>
          Continue
        </button>
      </div>
    </div>
  );
}
