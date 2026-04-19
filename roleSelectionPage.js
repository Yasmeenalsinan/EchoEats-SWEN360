import React, { useState, useEffect } from "react";
import "./App.css";

// ===== ROLE SELECTION PAGE =====
function RoleSelectionPage({ setCurrentPage, setUser, user, users, setUsers }) {
  const handleRoleSelect = (role) => {
    const updatedUser = { ...user, role };
    setUser(updatedUser);

    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, role } : u
    );
    setUsers(updatedUsers);

    setCurrentPage("profileCompletion");
  };

  return (
    <div className="role-selection-page">
      <div className="role-container">
        <button className="back-button" onClick={() => setCurrentPage("login")}>← Back</button>
        <h2>Continue as</h2>
        <div className="role-cards">
          <div className="role-card">
            <div className="role-icon">👤</div>
            <h3>Consumer</h3>
            <p>Find and purchase discounted food near you.</p>
            <button className="btn btn-primary" onClick={() => handleRoleSelect("consumer")}>Select</button>
          </div>
          <div className="role-card">
            <div className="role-icon">🏪</div>
            <h3>Vendor</h3>
            <p>List surplus food and reduce waste.</p>
            <button className="btn btn-primary" onClick={() => handleRoleSelect("vendor")}>Select</button>
          </div>
        </div>
      </div>
    </div>
  );
}
