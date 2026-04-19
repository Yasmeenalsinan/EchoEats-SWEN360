import React, { useState, useEffect } from "react";
import "./App.css";

// ===== FOOD LISTING PAGE (CONSUMER) =====
function FoodListingPage({ items, user, searchTerm, setSearchTerm, filterDietary, setFilterDietary, filterCategory, setFilterCategory, onItemClick, onLogout, setCurrentPage }) {
  console.log("📦 [FoodListingPage] Received items:", items);
  const availableItems = items.filter(i => !i.reserved);
  console.log("📦 [FoodListingPage] Available items (not reserved):", availableItems);
  const filteredItems = availableItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDietary = filterDietary === "All" || item.dietary === filterDietary;
    const matchesCategory = filterCategory === "All" || item.category === filterCategory;
    return matchesSearch && matchesDietary && matchesCategory;
  });

  const dietaryOptions = ["All", ...new Set(items.map(i => i.dietary))];
  const categoryOptions = ["All", ...new Set(items.map(i => i.category))];

  return (
    <div className="food-listing-page">
      <nav className="navbar">
        <div className="nav-left"><h1>🍽️ EchoEats</h1></div>
        <div className="nav-right">
          <span>{user.email}</span>
          <button className="btn btn-logout" onClick={onLogout}>Logout</button>
          <button className="profile-btn" onClick={() => setCurrentPage("profile")}>👤</button>
        </div>
      </nav>
      <div className="listing-container">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search for food..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filters-section">
          <select value={filterDietary} onChange={(e) => setFilterDietary(e.target.value)} className="filter-select">
            {dietaryOptions.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
          </select>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="filter-select">
            {categoryOptions.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
          </select>
        </div>
        {filteredItems.length === 0 ? (
          <div className="empty-state"><p>No items available</p></div>
        ) : (
          <div className="items-grid">
            {filteredItems.map(item => {
              const currentPrice = calculateDynamicPrice(item.basePrice, item.createdAt, item.expiryMinutes);
              const discount = getDiscountPercentage(item.basePrice, currentPrice);
              
              return (
                <div key={item.id} className="item-card" onClick={() => onItemClick(item)}>
                  <div className="item-image">
                    <img src={`https://via.placeholder.com/200x150?text=${encodeURIComponent(item.name)}`} alt={item.name} />
                    {discount > 0 && <div className="discount-badge">-{discount}%</div>}
                  </div>
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p className="item-price">${currentPrice.toFixed(2)} <span className="original-price">${item.basePrice.toFixed(2)}</span></p>
                    <p className="item-time">{formatTimeRemaining(item.createdAt, item.expiryMinutes)}</p>
                    <span className="dietary-tag">{item.dietary}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
