import React, { useState, useEffect } from "react";
import "./App.css";

// ===== LOGIN PAGE =====
function LoginPage({ setCurrentPage, setUser, users }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill all fields");
      return;
    }

    const registeredUser = users.find(u => u.email === formData.email);
    
    if (!registeredUser) {
      setError("Email not found. Please sign up first.");
      return;
    }

    if (registeredUser.password !== formData.password) {
      setError("Incorrect password");
      return;
    }

    // Login successful
    setUser({
      id: registeredUser.id,
      email: registeredUser.email,
      role: registeredUser.role,
      createdAt: registeredUser.createdAt
    });

    setCurrentPage(registeredUser.role === "vendor" ? "dashboard" : "browseItems");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Log In</h2>
        <p>Welcome back</p>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>EMAIL</label>
            <input
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>PASSWORD</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="form-input"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn btn-primary">Log In</button>
          <p className="auth-toggle">
            Don't have an account? <button type="button" className="link-button" onClick={() => setCurrentPage("signup")}>Sign Up</button>
          </p>
        </form>
      </div>
    </div>
  );
}
