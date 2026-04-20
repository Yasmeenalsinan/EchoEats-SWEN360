import React, { useState, useEffect } from "react";
import "./App.css";

  // ===== PAGE ROUTING =====
  
  // Welcome Page
  if (currentPage === "welcome" && !user) {
    return <WelcomePage setCurrentPage={setCurrentPage} />;
  }

  // Login Page
  if (currentPage === "login" && !user) {
    return <LoginPage 
      setCurrentPage={setCurrentPage} 
      setUser={setUser} 
      users={users}
    />;
  }

  // Signup Page
  if (currentPage === "signup" && !user) {
    return <SignupPage 
      setCurrentPage={setCurrentPage} 
      setUser={setUser}
      setUsers={setUsers}
      users={users}
    />;
  }

  // Role Selection Page
  if (currentPage === "roleSelection" && user && !user.role) {
    return <RoleSelectionPage 
      setCurrentPage={setCurrentPage} 
      setUser={setUser}
      user={user}
      users={users}
      setUsers={setUsers}
    />;
  }

  // Profile Completion Page
  if (currentPage === "profileCompletion" && user && !user.role) {
    return <ProfileCompletionPage 
      setCurrentPage={setCurrentPage} 
      setUser={setUser}
      user={user}
      users={users}
      setUsers={setUsers}
      userPreferences={userPreferences}
      setUserPreferences={setUserPreferences}
    />;
  }

  // Vendor: Add/Edit Item Form
  if (user?.role === "vendor" && showForm) {
    return <VendorItemFormPage 
      editingItem={editingItem}
      items={items}
      setItems={setItems}
      setShowForm={setShowForm}
      setEditingItem={setEditingItem}
      userId={user.id}
      userEmail={user.email}
      setCurrentPage={setCurrentPage}
    />;
  }

  // Vendor: View Active Listings
  if (user?.role === "vendor" && currentPage === "listings") {
    const vendorItems = items.filter(i => i.vendorId === user.id);
    return <ActiveListingsPage 
      items={vendorItems}
      onEdit={(item) => {
        setEditingItem(item);
        setShowForm(true);
      }}
      onDelete={(id) => {
        setItems(items.filter(i => i.id !== id));
      }}
      onMarkSold={(id) => {
        setItems(items.map(i => i.id === id ? { ...i, reserved: true } : i));
      }}
      onBack={() => setCurrentPage("dashboard")}
      onLogout={handleLogout}
    />;
  }

  // Vendor: Dashboard
  if (user?.role === "vendor" && (currentPage === "dashboard" || !currentPage)) {
    const vendorItems = items.filter(i => i.vendorId === user.id);
    const activeItems = vendorItems.filter(i => !i.reserved);
    const soldItems = vendorItems.filter(i => i.reserved);

    return <VendorDashboardPage 
      user={user}
      vendorItems={vendorItems}
      activeItems={activeItems}
      soldItems={soldItems}
      onLogout={handleLogout}
      setCurrentPage={setCurrentPage}
      setShowForm={setShowForm}
      setEditingItem={setEditingItem}
    />;
  }

  // Consumer: Item Details
  if (currentPage === "itemDetails" && selectedItem) {
    return <FoodItemDetailsPage 
      item={selectedItem}
      onReserve={() => handleReserve(selectedItem.id)}
      onBack={() => setCurrentPage("browseItems")}
    />;
  }

  // Consumer: Reservation Confirmation
  if (currentPage === "confirmReservation" && selectedItem) {
    return <ReservationConfirmationPage 
      reservation={selectedItem}
      onConfirm={() => {
        setCurrentPage("browseItems");
        setSelectedItem(null);
      }}
      onCancel={() => setCurrentPage("browseItems")}
    />;
  }

  // Consumer: Profile/Stats
  if (user?.role === "consumer" && currentPage === "profile") {
    const userReservations = reservations.filter(r => r.consumerId === user.id);
    const mealsRescued = userReservations.length;
    const moneySaved = userReservations.reduce((sum, r) => sum + (r.price || 0), 0);
    const co2Saved = mealsRescued * 0.45;

    return <UserProfilePage 
      user={user}
      mealsRescued={mealsRescued}
      moneySaved={moneySaved}
      co2Saved={co2Saved}
      onLogout={handleLogout}
      setCurrentPage={setCurrentPage}
    />;
  }

  // Consumer: Browse Items (default for consumer)
  if (user?.role === "consumer") {
    return <FoodListingPage 
      items={items}
      user={user}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      filterDietary={filterDietary}
      setFilterDietary={setFilterDietary}
      filterCategory={filterCategory}
      setFilterCategory={setFilterCategory}
      onItemClick={(item) => {
        setSelectedItem(item);
        setCurrentPage("itemDetails");
      }}
      onLogout={handleLogout}
      setCurrentPage={setCurrentPage}
    />;
  }

  // Vendor: Fallback Dashboard (if they log in without explicit page set)
  if (user?.role === "vendor") {
    const vendorItems = items.filter(i => i.vendorId === user.id);
    const activeItems = vendorItems.filter(i => !i.reserved);
    const soldItems = vendorItems.filter(i => i.reserved);

    return <VendorDashboardPage 
      user={user}
      vendorItems={vendorItems}
      activeItems={activeItems}
      soldItems={soldItems}
      onLogout={handleLogout}
      setCurrentPage={setCurrentPage}
      setShowForm={setShowForm}
      setEditingItem={setEditingItem}
    />;
  }

  return <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>;

