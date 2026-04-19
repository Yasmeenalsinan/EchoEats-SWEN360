import React, { useState, useEffect } from "react";
import "./App.css";

// ===== SIGNUP PAGE =====
function SignupPage({ setCurrentPage, setUser, setUsers, users }) {
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill all fields");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (users.find(u => u.email === formData.email)) {
      setError("This email is already registered");
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      email: formData.email,
      password: formData.password,
      role: null,
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);

    setUser({
      id: newUser.id,
      email: newUser.email,
      role: null,
      createdAt: newUser.createdAt
    });

    setCurrentPage("roleSelection");
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>Create Account</h2>
        <p>Join EchoEats today</p>
        <form onSubmit={handleSubmit} className="signup-form">
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
          <div className="form-group">
            <label>CONFIRM PASSWORD</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="form-input"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn btn-primary">Sign Up</button>
          <p className="auth-toggle">
            Already have an account? <button type="button" className="link-button" onClick={() => setCurrentPage("login")}>Log In</button>
          </p>
        </form>
      </div>
    </div>
  );
}
