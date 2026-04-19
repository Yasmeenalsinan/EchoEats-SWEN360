import React, { useState, useEffect } from "react";
import "./App.css";

// ===== RESERVATION CONFIRMATION PAGE =====
function ReservationConfirmationPage({ reservation, onConfirm, onCancel }) {
  return (
    <div className="confirmation-page">
      <div className="confirmation-container">
        <div className="success-icon">✓</div>
        <h2>Reservation Confirmed!</h2>
        <p>You've reserved: <strong>{reservation.itemName}</strong></p>
        <p>Price locked at: <strong>${reservation.price.toFixed(2)}</strong></p>
        <div className="button-group">
          <button className="btn btn-primary" onClick={onConfirm}>Back to Browse</button>
          <button className="btn btn-secondary" onClick={onCancel}>Cancel Reservation</button>
        </div>
      </div>
    </div>
  );
}
