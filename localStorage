import React, { useState, useEffect } from "react";
import "./App.css";

// ===== MAIN APP COMPONENT =====
export default function App() {
  const [currentPage, setCurrentPage] = useState("welcome");
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("allUsers");
    return saved ? JSON.parse(saved) : [];
  });
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("items");
    const parsed = saved ? JSON.parse(saved) : [];
    console.log("🔄 [App.js] Initializing items from localStorage:", parsed);
    return parsed;
  });
  const [reservations, setReservations] = useState(() => {
    const saved = localStorage.getItem("reservations");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDietary, setFilterDietary] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [userPreferences, setUserPreferences] = useState(() => {
    const saved = localStorage.getItem("userPreferences");
    return saved ? JSON.parse(saved) : { location: false, dietary: [], notifications: true };
  });

  // Save to localStorage
  useEffect(() => {
    console.log("💾 [App.js] Saving items to localStorage:", items);
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("reservations", JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("userPreferences", JSON.stringify(userPreferences));
  }, [userPreferences]);

  useEffect(() => {
    localStorage.setItem("allUsers", JSON.stringify(users));
  }, [users]);


  useEffect(() => {
    const interval = setInterval(() => {
      setItems([...items]);
    }, 30000);
    return () => clearInterval(interval);
  }, [items]);

  const handleLogout = () => {
    setUser(null);
    setCurrentPage("welcome");
    setShowForm(false);
    setEditingItem(null);
    localStorage.removeItem("currentUser");
  };

  const handleReserve = (itemId) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    const currentPrice = calculateDynamicPrice(item.basePrice, item.createdAt, item.expiryMinutes);
    
    const reservation = {
      id: Date.now(),
      consumerId: user.id,
      itemId: itemId,
      itemName: item.name,
      price: currentPrice,
      reservedAt: new Date().toISOString()
    };

    setReservations([...reservations, reservation]);
    setItems(items.map(i => 
      i.id === itemId ? { ...i, reserved: true, reservedBy: user.id } : i
    ));
    setSelectedItem(reservation);
    setCurrentPage("confirmReservation");
  };


}
