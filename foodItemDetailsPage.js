import React, { useState, useEffect } from "react";
import "./App.css";

// ===== FOOD ITEM DETAILS PAGE =====
function FoodItemDetailsPage({ item, onReserve, onBack }) {
  const currentPrice = calculateDynamicPrice(item.basePrice, item.createdAt, item.expiryMinutes);
  const discount = getDiscountPercentage(item.basePrice, currentPrice);

  return (
    <div className="item-details-page">
      <button className="back-button" onClick={onBack}>← Back</button>
      <div className="details-container">
        <img src={`https://via.placeholder.com/400x300?text=${encodeURIComponent(item.name)}`} alt={item.name} className="detail-image" />
        <div className="details-info">
          <h2>{item.name}</h2>
          <p className="description">{item.description}</p>
          <div className="price-info">
            <span className="current-price">${currentPrice.toFixed(2)}</span>
            <span className="original-price">${item.basePrice.toFixed(2)}</span>
            {discount > 0 && <span className="discount">Save {discount}%</span>}
          </div>
          <p className="time-remaining">Expires in: {formatTimeRemaining(item.createdAt, item.expiryMinutes)}</p>
          <p className="dietary">{item.dietary}</p>
          <button className="btn btn-primary btn-large" onClick={onReserve}>Reserve Now</button>
        </div>
      </div>
    </div>
  );
}
