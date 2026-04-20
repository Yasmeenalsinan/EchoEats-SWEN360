import React, { useState, useEffect } from "react";
import "./App.css";

// ===== UTILITIES =====
const calculateDynamicPrice = (basePrice, createdAt, expiryMinutes) => {
  const now = Date.now();
  const createdTime = new Date(createdAt).getTime();
  const expiryTime = createdTime + expiryMinutes * 60 * 1000;
  const timeRemaining = Math.max(0, expiryTime - now);
  const totalTime = expiryMinutes * 60 * 1000;
  const priceReduction = (basePrice * (totalTime - timeRemaining)) / totalTime;
  const currentPrice = Math.max(basePrice * 0.2, basePrice - priceReduction);
  return Math.round(currentPrice * 100) / 100;
};

const formatTimeRemaining = (createdAt, expiryMinutes) => {
  const expiryTime = new Date(createdAt).getTime() + expiryMinutes * 60 * 1000;
  const timeRemaining = expiryTime - Date.now();
  if (timeRemaining <= 0) return "Expired";
  const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const getDiscountPercentage = (basePrice, currentPrice) => {
  const discount = Math.round(((basePrice - currentPrice) / basePrice) * 100);
  return Math.max(0, discount);
};

