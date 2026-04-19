import React, { useState, useEffect } from "react";
import "./App.css";

// ===== VENDOR DASHBOARD PAGE =====
function VendorDashboardPage({ user, vendorItems, activeItems, soldItems, onLogout, setCurrentPage, setShowForm, setEditingItem }) {
  const totalRevenue = soldItems.reduce((sum, item) => 
    sum + calculateDynamicPrice(item.basePrice, item.createdAt, item.expiryMinutes), 0
  );

  return (
    <div className="vendor-dashboard-page">
      <nav className="navbar">
        <div className="nav-left"><h1>🍽️ EchoEats - Vendor</h1></div>
        <div className="nav-right">
          <span>{user.email}</span>
          <button className="btn btn-logout" onClick={onLogout}>Logout</button>
        </div>
      </nav>
      <div className="dashboard-container">
        <h2>Vendor Dashboard</h2>
        <div className="quick-actions">
          <button className="btn btn-primary" onClick={() => {
            setEditingItem(null);
            setShowForm(true);
          }}>+ New Listing</button>
          <button className="btn btn-secondary" onClick={() => setCurrentPage("listings")}>View Listings</button>
        </div>
        <div className="performance-metrics">
          <h3>Today's Performance</h3>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-value">{vendorItems.length}</div>
              <div className="metric-label">Items Listed</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{soldItems.length}</div>
              <div className="metric-label">Items Sold</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">${totalRevenue.toFixed(2)}</div>
              <div className="metric-label">Revenue</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{(soldItems.length * 0.5).toFixed(1)} kg</div>
              <div className="metric-label">Waste Reduced</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}