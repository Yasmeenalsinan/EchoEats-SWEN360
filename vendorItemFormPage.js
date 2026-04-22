import React, { useState, useEffect } from "react";
import "./App.css";

// ===== VENDOR ITEM FORM PAGE =====
function VendorItemFormPage({ editingItem, items, setItems, setShowForm, setEditingItem, userId, userEmail, setCurrentPage }) {
  const [formData, setFormData] = useState(editingItem || {
    name: "",
    description: "",
    basePrice: "",
    category: "Sandwiches",
    dietary: "Vegetarian",
    expiryMinutes: 60
  });
  

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("📝 [VendorItemFormPage] Form submitted with data:", formData);
    
    if (!formData.name || !formData.description || !formData.basePrice || !formData.expiryMinutes) {
      alert("Please fill all fields");
      return;
    }

    if (editingItem) {
      setItems(items.map(i => 
        i.id === editingItem.id ? { ...i, ...formData } : i
      ));
    } else {
      const newItem = {
        id: Date.now(),
        vendorId: userId,
        vendorEmail: userEmail,
        ...formData,
        basePrice: parseFloat(formData.basePrice),
        expiryMinutes: parseInt(formData.expiryMinutes),
        createdAt: new Date().toISOString(),
        reserved: false
      };
      console.log("✅ [VendorItemFormPage] Created new item:", newItem);
      setItems([...items, newItem]);
    }

    setShowForm(false);
    setEditingItem(null);
    setCurrentPage("dashboard");
  };

  return (
    <div className="vendor-form-page">
      <div className="form-container">
        <h2>{editingItem ? "Edit Item" : "Add New Item"}</h2>
        <form onSubmit={handleSubmit} className="vendor-form">
          <div className="form-group">
            <label>Item Name</label>
            <input
              type="text"
              placeholder="Fresh Croissants"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Describe your food item..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-input"
              rows="4"
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Base Price ($)</label>
              <input
                type="number"
                placeholder="24.99"
                step="0.01"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label>Expiry (minutes)</label>
              <input
                type="number"
                placeholder="60"
                value={formData.expiryMinutes}
                onChange={(e) => setFormData({ ...formData, expiryMinutes: e.target.value })}
                className="form-input"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-input"
              >
                <option>Sandwiches</option>
                <option>Wraps</option>
                <option>Pastries</option>
                <option>Beverages</option>
                <option>Desserts</option>
              </select>
            </div>
            <div className="form-group">
              <label>Dietary Type</label>
              <select
                value={formData.dietary}
                onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
                className="form-input"
              >
                <option>Vegetarian</option>
                <option>Vegan</option>
                <option>Non-Veg</option>
                <option>Gluten-Free</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingItem ? "Update Item" : "Add Item"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => {
              setShowForm(false);
              setEditingItem(null);
            }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
