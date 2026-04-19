import React, { useState, useEffect } from "react";
import "./App.css";

// ===== ACTIVE LISTINGS PAGE =====
function ActiveListingsPage({ items, onEdit, onDelete, onMarkSold, onBack, onLogout }) {
  return (
    <div className="listings-page">
      <nav className="navbar">
        <div className="nav-left"><h1>🍽️ Active Listings</h1></div>
        <div className="nav-right">
          <button className="btn btn-logout" onClick={onLogout}>Logout</button>
        </div>
      </nav>
      <div className="listings-container">
        <button className="back-button" onClick={onBack}>← Back</button>
        <div className="listings-list">
          {items.map((item, index) => {
            const currentPrice = calculateDynamicPrice(item.basePrice, item.createdAt, item.expiryMinutes);
            return (
              <div key={item.id} className="listing-card">
                <h4>{item.name}</h4>
                <p>${item.basePrice.toFixed(2)} → ${currentPrice.toFixed(2)}</p>
                <p>Expires: {formatTimeRemaining(item.createdAt, item.expiryMinutes)}</p>
                <div className="listing-actions">
                  <button className="btn btn-secondary" onClick={() => onEdit(item)}>Edit</button>
                  <button className="btn btn-secondary" onClick={() => onMarkSold(item.id)}>Mark Sold</button>
                  <button className="btn btn-danger" onClick={() => onDelete(item.id)}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}