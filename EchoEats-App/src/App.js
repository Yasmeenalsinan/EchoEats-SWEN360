/* ============================================================
 * EchoEats - Phase 3
 * Dynamic Pricing Food Waste Marketplace
 *
 * Addresses Phase 2 feedback:
 *  1. Dynamic pricing formula (prices drop over time)
 *  2. Auto-expiry (items automatically marked expired, cannot reserve)
 *  3. Price-drop notifications for favorited items
 *  4. Last-hour expiry notifications
 *  5. Food-themed UI with warm appetizing colors & imagery
 *  6. Live timer with hours/minutes/SECONDS
 * ============================================================ */
import React, { useState, useEffect } from "react";
import "./App.css";

/* ============================================================
 * 1. FOOD IMAGERY
 * ============================================================ */
const FOOD_EMOJI_MAP = {
  croissant: "🥐",
  bread: "🍞",
  sandwich: "🥪",
  wrap: "🌯",
  burrito: "🌯",
  burger: "🍔",
  pizza: "🍕",
  taco: "🌮",
  sushi: "🍣",
  salad: "🥗",
  pasta: "🍝",
  noodle: "🍜",
  ramen: "🍜",
  rice: "🍚",
  soup: "🍲",
  steak: "🥩",
  chicken: "🍗",
  fish: "🐟",
  egg: "🥚",
  cheese: "🧀",
  donut: "🍩",
  doughnut: "🍩",
  cookie: "🍪",
  cake: "🍰",
  cupcake: "🧁",
  pie: "🥧",
  pancake: "🥞",
  waffle: "🧇",
  pastry: "🥐",
  muffin: "🧁",
  chocolate: "🍫",
  ice: "🍨",
  fruit: "🍎",
  apple: "🍎",
  banana: "🍌",
  berry: "🫐",
  smoothie: "🥤",
  coffee: "☕",
  tea: "🍵",
  juice: "🧃",
  water: "💧",
  beverage: "🥤",
  drink: "🥤",
};

const CATEGORY_EMOJI = {
  Sandwiches: "🥪",
  Wraps: "🌯",
  Pastries: "🥐",
  Beverages: "🥤",
  Desserts: "🍰",
  Salads: "🥗",
  "Hot Meals": "🍲",
  Bakery: "🍞",
};

const CATEGORY_GRADIENT = {
  Sandwiches: "linear-gradient(135deg, #FFB347 0%, #FF6B35 100%)",
  Wraps: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
  Pastries: "linear-gradient(135deg, #FFD89B 0%, #F4A460 100%)",
  Beverages: "linear-gradient(135deg, #89CFF0 0%, #4CAF50 100%)",
  Desserts: "linear-gradient(135deg, #FFB6C1 0%, #E91E63 100%)",
  Salads: "linear-gradient(135deg, #A8E6CF 0%, #4CAF50 100%)",
  "Hot Meals": "linear-gradient(135deg, #FFA07A 0%, #FF4500 100%)",
  Bakery: "linear-gradient(135deg, #FFE4B5 0%, #D2691E 100%)",
};

// Expanded dietary options — accommodates more lifestyles + religious diets
const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Non-Veg",
  "Gluten-Free",
  "Halal",
  "Kosher",
  "Dairy-Free",
  "Nut-Free",
  "Keto",
];

/** Normalize an item's `dietary` field to an array (supports legacy string). */
export function getDietList(item) {
  if (!item) return [];
  const d = item.dietary;
  if (!d) return [];
  return Array.isArray(d) ? d : [d];
}

export function getFoodEmoji(name = "", category = "") {
  const lower = name.toLowerCase();
  for (const key of Object.keys(FOOD_EMOJI_MAP)) {
    if (lower.includes(key)) return FOOD_EMOJI_MAP[key];
  }
  return CATEGORY_EMOJI[category] || "🍽️";
}

export function getCategoryGradient(category = "") {
  return (
    CATEGORY_GRADIENT[category] ||
    "linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)"
  );
}

/* ============================================================
 * 2. DYNAMIC PRICING ENGINE
 * ============================================================ */
const HOURLY_DROP_RATE = 0.15; // 15% per hour
const MIN_PRICE_FLOOR = 0.2; // never below 20% of base

export function calculateDynamicPrice(basePrice, createdAt, expiryMinutes) {
  const now = Date.now();
  const created = new Date(createdAt).getTime();
  const elapsedMs = Math.max(0, now - created);
  const elapsedHours = elapsedMs / (1000 * 60 * 60);

  let price = basePrice * Math.pow(1 - HOURLY_DROP_RATE, elapsedHours);
  const floor = basePrice * MIN_PRICE_FLOOR;
  if (price < floor) price = floor;
  return Math.round(price * 100) / 100;
}

export function getDiscountPercentage(basePrice, currentPrice) {
  if (basePrice <= 0) return 0;
  const discount = Math.round(((basePrice - currentPrice) / basePrice) * 100);
  return Math.max(0, discount);
}

/* ============================================================
 * 3. EXPIRY + TIME HELPERS — timer now shows SECONDS too
 * ============================================================ */
export function getExpiryTimestamp(item) {
  return new Date(item.createdAt).getTime() + item.expiryMinutes * 60 * 1000;
}

export function isExpired(item) {
  return Date.now() >= getExpiryTimestamp(item);
}

export function minutesRemaining(item) {
  return Math.max(0, Math.floor((getExpiryTimestamp(item) - Date.now()) / 60000));
}

/**
 * formatTimeRemaining
 * Returns a live "Hh Mm Ss" string (with seconds) so the countdown
 * is visible at the second-level on every card and detail page.
 * Examples:
 *   "2h 14m 07s"
 *   "45m 32s"
 *   "12s"
 *   "Expired"
 */
export function formatTimeRemaining(item) {
  const remaining = getExpiryTimestamp(item) - Date.now();
  if (remaining <= 0) return "Expired";
  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n) => String(n).padStart(2, "0");
  if (hours > 0) return `${hours}h ${pad(minutes)}m ${pad(seconds)}s`;
  if (minutes > 0) return `${minutes}m ${pad(seconds)}s`;
  return `${seconds}s`;
}

/* ============================================================
 * 4. LOCATION + DISTANCE
 *    For the demo we centre everything in Manama, Bahrain. Each
 *    item gets a random lat/lng within ~5 km of the user's location
 *    when created, so the map shows realistic spread.
 * ============================================================ */
const USER_DEFAULT_LOCATION = { lat: 26.2235, lng: 50.5876, label: "Manama, Bahrain" };

// Preset cities — used for the location picker and for nearest-city labels.
const PRESET_CITIES = [
  { label: "Manama, Bahrain", lat: 26.2235, lng: 50.5876, emoji: "🇧🇭" },
  { label: "Riffa, Bahrain", lat: 26.1300, lng: 50.5550, emoji: "🇧🇭" },
  { label: "Muharraq, Bahrain", lat: 26.2572, lng: 50.6119, emoji: "🇧🇭" },
  { label: "Dubai, UAE", lat: 25.2048, lng: 55.2708, emoji: "🇦🇪" },
  { label: "Abu Dhabi, UAE", lat: 24.4539, lng: 54.3773, emoji: "🇦🇪" },
  { label: "Doha, Qatar", lat: 25.2854, lng: 51.5310, emoji: "🇶🇦" },
  { label: "Riyadh, Saudi Arabia", lat: 24.7136, lng: 46.6753, emoji: "🇸🇦" },
  { label: "Kuwait City, Kuwait", lat: 29.3759, lng: 47.9774, emoji: "🇰🇼" },
];

/** Given a lat/lng, return the closest preset city label or "Custom location". */
export function nearestCityLabel(loc) {
  if (!loc) return "Custom location";
  let best = null, bestKm = Infinity;
  for (const c of PRESET_CITIES) {
    const d = distanceKm(loc, c);
    if (d < bestKm) { bestKm = d; best = c; }
  }
  if (bestKm < 8) return best.label;
  if (bestKm < 50) return `Near ${best.label}`;
  return "Custom location";
}

/** Generate a random point within `radiusKm` of `center`. */
export function randomNearby(center, radiusKm = 5) {
  // 1° latitude ≈ 111 km
  const radiusInDeg = radiusKm / 111;
  const u = Math.random();
  const v = Math.random();
  const w = radiusInDeg * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const dx = w * Math.cos(t);
  const dy = w * Math.sin(t) / Math.cos((center.lat * Math.PI) / 180);
  return {
    lat: +(center.lat + dx).toFixed(6),
    lng: +(center.lng + dy).toFixed(6),
  };
}

/** Haversine distance in kilometres. */
export function distanceKm(a, b) {
  if (!a || !b) return Infinity;
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function formatDistance(km) {
  if (!isFinite(km)) return "—";
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

/* ============================================================
 * 5. LOCALSTORAGE HELPERS
 * ============================================================ */
function loadLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

/* ============================================================
 * 5. MAIN APP
 * ============================================================ */
export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const savedUser = loadLS("currentUser", null);
    if (!savedUser) return "welcome";
    if (!savedUser.role) return "roleSelection";
    return savedUser.role === "vendor" ? "dashboard" : "browseItems";
  });
  const [user, setUser] = useState(() => loadLS("currentUser", null));
  const [users, setUsers] = useState(() => loadLS("allUsers", []));
  const [items, setItems] = useState(() => loadLS("items", []));
  const [reservations, setReservations] = useState(() =>
    loadLS("reservations", [])
  );
  const [favorites, setFavorites] = useState(() => loadLS("favorites", {}));
  const [notifications, setNotifications] = useState(() =>
    loadLS("notifications", {})
  );

  const [selectedItem, setSelectedItem] = useState(null);
  const [lastReservation, setLastReservation] = useState(null);
  // Pending reservation while user goes through payment flow
  const [pendingItem, setPendingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  // Multi-select: array of selected dietary tags. Empty = no restriction.
  const [filterDietary, setFilterDietary] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  // List vs Map view on consumer browse
  const [viewMode, setViewMode] = useState(() => loadLS("viewMode", "list"));
  // Simulated GPS location for the demo. Persisted so it stays consistent.
  const [userLocation, setUserLocation] = useState(() =>
    loadLS("userLocation", USER_DEFAULT_LOCATION)
  );
  // tick is used purely to force a re-render every second so the
  // Hh Mm Ss timers update live on every card / detail view.
  const [tick, setTick] = useState(0);

  /* ---------- persist to localStorage ---------- */
  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);
  useEffect(() => {
    localStorage.setItem("reservations", JSON.stringify(reservations));
  }, [reservations]);
  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(user));
  }, [user]);
  useEffect(() => {
    localStorage.setItem("allUsers", JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);
  useEffect(() => {
    localStorage.setItem("viewMode", JSON.stringify(viewMode));
  }, [viewMode]);
  useEffect(() => {
    localStorage.setItem("userLocation", JSON.stringify(userLocation));
  }, [userLocation]);

  // Backfill lat/lng on any items that don't have one (older listings,
  // for example) so the map can always plot every available item.
  useEffect(() => {
    let needsUpdate = false;
    const updated = items.map((i) => {
      if (i.lat == null || i.lng == null) {
        needsUpdate = true;
        const loc = randomNearby(userLocation, 5);
        return { ...i, lat: loc.lat, lng: loc.lng };
      }
      return i;
    });
    if (needsUpdate) setItems(updated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- 1-second live clock for timers ---------- */
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  /* ---------- Notification engine ---------- */
  useEffect(() => {
    if (!user || user.role !== "consumer") return;
    const userFavs = favorites[user.id] || [];
    const userNotifs = notifications[user.id] || [];
    const newNotifs = [];

    userFavs.forEach((fav) => {
      const item = items.find((i) => i.id === fav.itemId);
      if (!item) return;
      const currentPrice = calculateDynamicPrice(
        item.basePrice,
        item.createdAt,
        item.expiryMinutes
      );
      const dropPct =
        ((fav.priceAtFavorite - currentPrice) / fav.priceAtFavorite) * 100;

      const priceKey = `PRICE_${item.id}_${Math.floor(dropPct / 10) * 10}`;
      if (
        dropPct >= 10 &&
        !userNotifs.find((n) => n.key === priceKey) &&
        !item.reserved &&
        !isExpired(item)
      ) {
        newNotifs.push({
          id: Date.now() + Math.random(),
          key: priceKey,
          type: "price_drop",
          itemId: item.id,
          itemName: item.name,
          message: `💰 ${item.name} dropped ${Math.floor(
            dropPct
          )}%! Now $${currentPrice.toFixed(2)}`,
          createdAt: new Date().toISOString(),
          read: false,
        });
      }

      const minsLeft = minutesRemaining(item);
      const lastHourKey = `LASTHOUR_${item.id}`;
      if (
        minsLeft <= 60 &&
        minsLeft > 0 &&
        !item.reserved &&
        !userNotifs.find((n) => n.key === lastHourKey)
      ) {
        newNotifs.push({
          id: Date.now() + Math.random(),
          key: lastHourKey,
          type: "last_hour",
          itemId: item.id,
          itemName: item.name,
          message: `⏰ Hurry! ${item.name} expires in ${minsLeft}m — now $${currentPrice.toFixed(2)}`,
          createdAt: new Date().toISOString(),
          read: false,
        });
      }

      const expiredKey = `EXPIRED_${item.id}`;
      if (isExpired(item) && !userNotifs.find((n) => n.key === expiredKey)) {
        newNotifs.push({
          id: Date.now() + Math.random(),
          key: expiredKey,
          type: "expired",
          itemId: item.id,
          itemName: item.name,
          message: `⚠️ ${item.name} has expired.`,
          createdAt: new Date().toISOString(),
          read: false,
        });
      }
    });

    if (newNotifs.length > 0) {
      setNotifications({
        ...notifications,
        [user.id]: [...newNotifs, ...userNotifs],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, items, favorites, user]);

  /* ---------- AUTH ---------- */
  const handleLogout = () => {
    setUser(null);
    setCurrentPage("welcome");
    setShowForm(false);
    setEditingItem(null);
    localStorage.removeItem("currentUser");
  };

  /* ---------- RESERVE (blocks expired) -----------
   * Phase 3 step 1: validate and route to the payment flow.
   * The actual reservation is only committed in finalizeReservation()
   * after payment is "authenticated" (faked). This mirrors a real
   * checkout where availability is held but not finalized until
   * payment succeeds.
   * ----------------------------------------------- */
  const handleReserve = (itemId) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    if (isExpired(item)) {
      alert("⚠️ Sorry, this item has expired and cannot be reserved.");
      return;
    }
    if (item.reserved) {
      alert("⚠️ This item has already been reserved.");
      return;
    }
    setPendingItem(item);
    setCurrentPage("payment");
  };

  /* ---------- FINALIZE RESERVATION (after payment) ---------- */
  const finalizeReservation = (paymentMethod, paymentMeta = {}) => {
    if (!pendingItem) return;
    const item = pendingItem;
    // Re-check expiry just before committing (defence in depth)
    if (isExpired(item)) {
      alert("⚠️ Sorry, this item expired during checkout.");
      setPendingItem(null);
      setCurrentPage("browseItems");
      return;
    }
    const currentPrice = calculateDynamicPrice(
      item.basePrice,
      item.createdAt,
      item.expiryMinutes
    );
    const reservation = {
      id: Date.now(),
      consumerId: user.id,
      consumerEmail: user.email,
      itemId: item.id,
      itemName: item.name,
      price: currentPrice,
      reservedAt: new Date().toISOString(),
      paymentMethod,           // "cash" | "card" | "applepay"
      paymentMeta,             // e.g. { last4, brand } for card
    };
    setReservations([...reservations, reservation]);
    setItems(
      items.map((i) =>
        i.id === item.id ? { ...i, reserved: true, reservedBy: user.id } : i
      )
    );
    // Send a notification to the vendor about the new reservation
    if (item.vendorId) {
      const vendorList = notifications[item.vendorId] || [];
      const vendorNotif = {
        id: Date.now() + Math.random(),
        key: `RESERVED_${reservation.id}`,
        type: "reservation_received",
        itemId: item.id,
        itemName: item.name,
        consumerEmail: user.email,
        price: currentPrice,
        message: `🎉 ${user.email} reserved ${item.name} for $${currentPrice.toFixed(2)} (${paymentMethod === "cash" ? "Cash on pickup" : paymentMethod === "applepay" ? "Apple Pay" : "Card"})`,
        createdAt: new Date().toISOString(),
        read: false,
      };
      setNotifications({
        ...notifications,
        [item.vendorId]: [vendorNotif, ...vendorList],
      });
    }
    setLastReservation(reservation);
    setPendingItem(null);
    setCurrentPage("confirmReservation");
  };

  /* ---------- FAVORITES ---------- */
  const toggleFavorite = (item) => {
    if (!user) return;
    const list = favorites[user.id] || [];
    const already = list.find((f) => f.itemId === item.id);
    const currentPrice = calculateDynamicPrice(
      item.basePrice,
      item.createdAt,
      item.expiryMinutes
    );
    if (already) {
      setFavorites({
        ...favorites,
        [user.id]: list.filter((f) => f.itemId !== item.id),
      });
    } else {
      setFavorites({
        ...favorites,
        [user.id]: [
          ...list,
          {
            itemId: item.id,
            priceAtFavorite: currentPrice,
            savedAt: new Date().toISOString(),
          },
        ],
      });
    }
  };

  const isFavorited = (itemId) => {
    if (!user) return false;
    return (favorites[user.id] || []).some((f) => f.itemId === itemId);
  };

  const markAllNotificationsRead = () => {
    if (!user) return;
    const list = notifications[user.id] || [];
    setNotifications({
      ...notifications,
      [user.id]: list.map((n) => ({ ...n, read: true })),
    });
  };

  const clearNotifications = () => {
    if (!user) return;
    setNotifications({ ...notifications, [user.id]: [] });
  };

  const unreadCount = user
    ? (notifications[user.id] || []).filter((n) => !n.read).length
    : 0;

  /* ========================= ROUTING ========================= */

  if (currentPage === "welcome" && !user) {
    return <WelcomePage setCurrentPage={setCurrentPage} />;
  }

  if (currentPage === "login" && !user) {
    return (
      <LoginPage
        setCurrentPage={setCurrentPage}
        setUser={setUser}
        users={users}
      />
    );
  }

  if (currentPage === "signup" && !user) {
    return (
      <SignupPage
        setCurrentPage={setCurrentPage}
        setUser={setUser}
        setUsers={setUsers}
        users={users}
      />
    );
  }

  if (currentPage === "forgotPassword" && !user) {
    return (
      <ForgotPasswordPage
        setCurrentPage={setCurrentPage}
        users={users}
        setUsers={setUsers}
      />
    );
  }

  if (currentPage === "roleSelection" && user && !user.role) {
    return (
      <RoleSelectionPage
        setCurrentPage={setCurrentPage}
        setUser={setUser}
        user={user}
        users={users}
        setUsers={setUsers}
      />
    );
  }

  // ---- VENDOR ----
  if (user?.role === "vendor" && showForm) {
    return (
      <VendorItemFormPage
        editingItem={editingItem}
        items={items}
        setItems={setItems}
        setShowForm={setShowForm}
        setEditingItem={setEditingItem}
        userId={user.id}
        userEmail={user.email}
        setCurrentPage={setCurrentPage}
      />
    );
  }

  if (user?.role === "vendor" && currentPage === "listings") {
    const vendorItems = items.filter((i) => i.vendorId === user.id);
    return (
      <ActiveListingsPage
        items={vendorItems}
        onEdit={(item) => {
          setEditingItem(item);
          setShowForm(true);
        }}
        onDelete={(id) => setItems(items.filter((i) => i.id !== id))}
        onMarkSold={(id) =>
          setItems(items.map((i) => (i.id === id ? { ...i, reserved: true } : i)))
        }
        onBack={() => setCurrentPage("dashboard")}
        onLogout={handleLogout}
        user={user}
      />
    );
  }

  // Vendor notifications page
  if (user?.role === "vendor" && currentPage === "notifications") {
    const notifList = notifications[user.id] || [];
    return (
      <NotificationsPage
        notifications={notifList}
        markAllRead={markAllNotificationsRead}
        clearAll={clearNotifications}
        onItemClick={(itemId) => {
          // For vendor: clicking takes them to listings, not consumer details
          setCurrentPage("listings");
        }}
        onBack={() => setCurrentPage("dashboard")}
        onLogout={handleLogout}
        user={user}
        setCurrentPage={setCurrentPage}
        isVendor
      />
    );
  }

  // Edit profile (works for both consumer + vendor)
  if (user && currentPage === "editProfile") {
    return (
      <EditProfilePage
        user={user}
        users={users}
        onSave={(updatedUser) => {
          setUser(updatedUser);
          setUsers(
            users.map((u) =>
              u.id === updatedUser.id ? { ...u, ...updatedUser } : u
            )
          );
          alert("✅ Profile updated successfully");
          setCurrentPage(user.role === "vendor" ? "dashboard" : "profile");
        }}
        onBack={() =>
          setCurrentPage(user.role === "vendor" ? "dashboard" : "profile")
        }
      />
    );
  }

  if (user?.role === "vendor") {
    const vendorItems = items.filter((i) => i.vendorId === user.id);
    const activeItems = vendorItems.filter(
      (i) => !i.reserved && !isExpired(i)
    );
    const soldItems = vendorItems.filter((i) => i.reserved);
    return (
      <VendorDashboardPage
        user={user}
        vendorItems={vendorItems}
        activeItems={activeItems}
        soldItems={soldItems}
        onLogout={handleLogout}
        setCurrentPage={setCurrentPage}
        setShowForm={setShowForm}
        setEditingItem={setEditingItem}
        unreadCount={unreadCount}
      />
    );
  }

  // ---- LOCATION PICKER (consumer) ----
  if (currentPage === "locationPicker") {
    return (
      <LocationPickerPage
        title="Set Your Pickup Location"
        subtitle="We'll show you food deals you can pick up near here."
        initial={userLocation}
        onConfirm={(loc) => {
          setUserLocation(loc);
          setCurrentPage("browseItems");
        }}
        onCancel={() => setCurrentPage("browseItems")}
      />
    );
  }

  // ---- CONSUMER ----
  if (currentPage === "itemDetails" && selectedItem) {
    return (
      <FoodItemDetailsPage
        item={selectedItem}
        onReserve={() => handleReserve(selectedItem.id)}
        onBack={() => setCurrentPage("browseItems")}
        isFavorited={isFavorited(selectedItem.id)}
        toggleFavorite={() => toggleFavorite(selectedItem)}
        user={user}
      />
    );
  }

  // ---- PAYMENT FLOW ----
  if (user?.role === "consumer" && currentPage === "payment" && pendingItem) {
    return (
      <PaymentMethodPage
        item={pendingItem}
        onSelectMethod={(method) => {
          if (method === "cash") {
            // Cash: no auth, finalize immediately
            finalizeReservation("cash");
          } else if (method === "card") {
            setCurrentPage("cardEntry");
          } else if (method === "applepay") {
            setCurrentPage("applePayAuth");
          }
        }}
        onCancel={() => {
          setPendingItem(null);
          setCurrentPage("browseItems");
        }}
      />
    );
  }

  if (user?.role === "consumer" && currentPage === "cardEntry" && pendingItem) {
    return (
      <CardEntryPage
        item={pendingItem}
        onConfirm={(cardData) => {
          // Stash payment metadata on pendingItem so the auth screen
          // can finalize correctly without losing it
          setPendingItem({ ...pendingItem, _cardData: cardData });
          setCurrentPage("cardAuth");
        }}
        onBack={() => setCurrentPage("payment")}
      />
    );
  }

  if (user?.role === "consumer" && currentPage === "cardAuth" && pendingItem) {
    return (
      <ProcessingPage
        label="Authenticating your card..."
        sub="Verifying with issuer (3D Secure)"
        emoji="🔒"
        delay={1800}
        onComplete={() => {
          const c = pendingItem._cardData || {};
          finalizeReservation("card", {
            last4: (c.number || "").replace(/\s/g, "").slice(-4),
            brand: c.brand,
            cardholder: c.name,
          });
        }}
      />
    );
  }

  if (user?.role === "consumer" && currentPage === "applePayAuth" && pendingItem) {
    return (
      <ProcessingPage
        label="Confirming with Apple Pay..."
        sub="Hold near reader / authenticate with Face ID"
        emoji="🍎"
        delay={1500}
        onComplete={() => finalizeReservation("applepay")}
      />
    );
  }

  if (currentPage === "confirmReservation" && lastReservation) {
    return (
      <ReservationConfirmationPage
        reservation={lastReservation}
        onConfirm={() => {
          setCurrentPage("browseItems");
          setSelectedItem(null);
          setLastReservation(null);
        }}
        onCancel={() => {
          setReservations(
            reservations.filter((r) => r.id !== lastReservation.id)
          );
          setItems(
            items.map((i) =>
              i.id === lastReservation.itemId
                ? { ...i, reserved: false, reservedBy: null }
                : i
            )
          );
          setLastReservation(null);
          setCurrentPage("browseItems");
        }}
      />
    );
  }

  if (user?.role === "consumer" && currentPage === "profile") {
    const userReservations = reservations.filter(
      (r) => r.consumerId === user.id
    );
    const mealsRescued = userReservations.length;
    const moneySaved = userReservations.reduce(
      (sum, r) => sum + (r.price || 0),
      0
    );
    const co2Saved = mealsRescued * 0.45;
    return (
      <UserProfilePage
        user={user}
        mealsRescued={mealsRescued}
        moneySaved={moneySaved}
        co2Saved={co2Saved}
        onLogout={handleLogout}
        setCurrentPage={setCurrentPage}
        unreadCount={unreadCount}
      />
    );
  }

  // Reservation history (consumer)
  if (user?.role === "consumer" && currentPage === "history") {
    const myReservations = reservations
      .filter((r) => r.consumerId === user.id)
      .sort((a, b) => new Date(b.reservedAt) - new Date(a.reservedAt));
    return (
      <ReservationHistoryPage
        reservations={myReservations}
        items={items}
        onItemClick={(itemId) => {
          const it = items.find((i) => i.id === itemId);
          if (it) {
            setSelectedItem(it);
            setCurrentPage("itemDetails");
          }
        }}
        onBack={() => setCurrentPage("profile")}
        onLogout={handleLogout}
        user={user}
        setCurrentPage={setCurrentPage}
        unreadCount={unreadCount}
      />
    );
  }

  if (user?.role === "consumer" && currentPage === "favorites") {
    const favList = (favorites[user.id] || [])
      .map((f) => items.find((i) => i.id === f.itemId))
      .filter(Boolean);
    return (
      <FavoritesPage
        favList={favList}
        onItemClick={(item) => {
          setSelectedItem(item);
          setCurrentPage("itemDetails");
        }}
        toggleFavorite={toggleFavorite}
        onBack={() => setCurrentPage("browseItems")}
        onLogout={handleLogout}
        user={user}
        setCurrentPage={setCurrentPage}
        unreadCount={unreadCount}
      />
    );
  }

  if (user?.role === "consumer" && currentPage === "notifications") {
    const notifList = notifications[user.id] || [];
    return (
      <NotificationsPage
        notifications={notifList}
        markAllRead={markAllNotificationsRead}
        clearAll={clearNotifications}
        onItemClick={(itemId) => {
          const item = items.find((i) => i.id === itemId);
          if (item) {
            setSelectedItem(item);
            setCurrentPage("itemDetails");
          }
        }}
        onBack={() => setCurrentPage("browseItems")}
        onLogout={handleLogout}
        user={user}
        setCurrentPage={setCurrentPage}
      />
    );
  }

  if (user?.role === "consumer") {
    return (
      <FoodListingPage
        items={items}
        user={user}
        userLocation={userLocation}
        viewMode={viewMode}
        setViewMode={setViewMode}
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
        isFavorited={isFavorited}
        toggleFavorite={toggleFavorite}
        unreadCount={unreadCount}
      />
    );
  }

  return <div className="loading">Loading...</div>;
}

/* ============================================================
 * NAV
 * ============================================================ */
function ConsumerNav({ user, onLogout, setCurrentPage, unreadCount, current }) {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <span className="nav-logo">🍽️</span>
        <h1>EchoEats</h1>
      </div>
      <div className="nav-right">
        <button
          className={`nav-btn ${current === "browseItems" ? "active" : ""}`}
          onClick={() => setCurrentPage("browseItems")}
          title="Browse"
        >
          🏠
        </button>
        <button
          className={`nav-btn ${current === "favorites" ? "active" : ""}`}
          onClick={() => setCurrentPage("favorites")}
          title="Saved"
        >
          ❤️
        </button>
        <button
          className={`nav-btn notif-btn ${
            current === "notifications" ? "active" : ""
          }`}
          onClick={() => setCurrentPage("notifications")}
          title="Notifications"
        >
          🔔
          {unreadCount > 0 && (
            <span className="notif-badge">{unreadCount}</span>
          )}
        </button>
        <button
          className={`nav-btn ${current === "profile" ? "active" : ""}`}
          onClick={() => setCurrentPage("profile")}
          title="Profile"
        >
          👤
        </button>
        <button className="btn btn-logout" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

/* ============================================================
 * WELCOME
 * ============================================================ */
function WelcomePage({ setCurrentPage }) {
  return (
    <div className="welcome-page">
      <div className="welcome-backdrop">
        <div className="floating-emoji e1">🍕</div>
        <div className="floating-emoji e2">🥐</div>
        <div className="floating-emoji e3">🥗</div>
        <div className="floating-emoji e4">🍔</div>
        <div className="floating-emoji e5">🍰</div>
        <div className="floating-emoji e6">🥪</div>
        <div className="floating-emoji e7">🍩</div>
        <div className="floating-emoji e8">🍣</div>
      </div>
      <div className="welcome-container">
        <div className="welcome-header">
          <div className="logo-circle">🍽️</div>
          <h1 className="brand-title">EchoEats</h1>
          <p className="brand-tagline">Fresh Food. Fair Prices. Zero Waste.</p>
        </div>
        <div className="benefits">
          <div className="benefit-item">
            <span className="benefit-icon">📉</span>
            <div>
              <strong>Dynamic Pricing</strong>
              <span>Prices drop as expiry approaches</span>
            </div>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">💰</span>
            <div>
              <strong>Save Money</strong>
              <span>Up to 80% off everyday meals</span>
            </div>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">🌱</span>
            <div>
              <strong>Save the Planet</strong>
              <span>Every meal saved = less waste</span>
            </div>
          </div>
        </div>
        <div className="welcome-actions">
          <button
            className="btn btn-primary btn-large"
            onClick={() => setCurrentPage("login")}
          >
            Log In
          </button>
          <button
            className="btn btn-secondary btn-large"
            onClick={() => setCurrentPage("signup")}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * LOGIN
 * ============================================================ */
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
    const registered = users.find((u) => u.email === formData.email);
    if (!registered) {
      setError("Invalid login credentials");
      return;
    }
    if (registered.password !== formData.password) {
      setError("Invalid login credentials");
      return;
    }
    setUser({
      id: registered.id,
      email: registered.email,
      role: registered.role,
      businessName: registered.businessName,
      createdAt: registered.createdAt,
    });
    setCurrentPage(registered.role === "vendor" ? "dashboard" : "browseItems");
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <button
          className="back-button"
          onClick={() => setCurrentPage("welcome")}
        >
          ← Back
        </button>
        <div className="auth-logo">🍽️</div>
        <h2>Log In</h2>
        <p className="subtitle">Welcome back to EchoEats</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>EMAIL</label>
            <input
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>PASSWORD</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="form-input"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn btn-primary btn-large">
            Log In
          </button>
          <p className="auth-toggle">
            <button
              type="button"
              className="link-button"
              onClick={() => setCurrentPage("forgotPassword")}
            >
              Forgot password?
            </button>
          </p>
          <p className="auth-toggle">
            Don't have an account?{" "}
            <button
              type="button"
              className="link-button"
              onClick={() => setCurrentPage("signup")}
            >
              Sign Up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

/* ============================================================
 * SIGNUP
 * ============================================================ */
function SignupPage({ setCurrentPage, setUser, setUsers, users }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill all required fields");
      return;
    }
    if (
      formData.password.length < 8 ||
      !/[a-zA-Z]/.test(formData.password) ||
      !/[0-9]/.test(formData.password)
    ) {
      setError(
        "Password must be at least 8 characters with a mix of letters and numbers."
      );
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (users.find((u) => u.email === formData.email)) {
      setError("An account with this email already exists. Please login instead.");
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      email: formData.email,
      password: formData.password,
      role: null,
      createdAt: new Date().toISOString(),
    };

    setUsers([...users, newUser]);
    setUser({
      id: newUser.id,
      email: newUser.email,
      role: null,
      createdAt: newUser.createdAt,
    });
    setCurrentPage("roleSelection");
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <button
          className="back-button"
          onClick={() => setCurrentPage("welcome")}
        >
          ← Back
        </button>
        <div className="auth-logo">🍽️</div>
        <h2>Create Account</h2>
        <p className="subtitle">Join EchoEats today</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>EMAIL</label>
            <input
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>PASSWORD</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>CONFIRM PASSWORD</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="form-input"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn btn-primary btn-large">
            Sign Up
          </button>
          <p className="auth-toggle">
            Already have an account?{" "}
            <button
              type="button"
              className="link-button"
              onClick={() => setCurrentPage("login")}
            >
              Log In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

/* ============================================================
 * ROLE SELECTION
 * ============================================================ */
function RoleSelectionPage({ setCurrentPage, setUser, user, users, setUsers }) {
  const [vendorStep, setVendorStep] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState("");

  const handleRoleSelect = (role) => {
    if (role === "vendor") {
      setVendorStep(true);
      return;
    }
    const updatedUser = { ...user, role };
    setUser(updatedUser);
    setUsers(users.map((u) => (u.id === user.id ? { ...u, role } : u)));
    setCurrentPage("browseItems");
  };

  const handleVendorContinue = () => {
    if (!businessName.trim()) {
      setError("Business name is required");
      return;
    }
    const updatedUser = { ...user, role: "vendor", businessName };
    setUser(updatedUser);
    setUsers(
      users.map((u) =>
        u.id === user.id ? { ...u, role: "vendor", businessName } : u
      )
    );
    setCurrentPage("dashboard");
  };

  if (vendorStep) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <button className="back-button" onClick={() => setVendorStep(false)}>
            ← Back
          </button>
          <div className="auth-logo">🏪</div>
          <h2>Business Details</h2>
          <p className="subtitle">Tell us about your business</p>
          <div className="auth-form">
            <div className="form-group">
              <label>BUSINESS NAME</label>
              <input
                type="text"
                placeholder="e.g. Sunny Bakery"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="form-input"
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button
              className="btn btn-primary btn-large"
              onClick={handleVendorContinue}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container role-container">
        <button
          className="back-button"
          onClick={() => setCurrentPage("welcome")}
        >
          ← Back
        </button>
        <h2>Continue as</h2>
        <p className="subtitle">Choose your account type</p>
        <div className="role-cards">
          <div className="role-card">
            <div className="role-icon">🛒</div>
            <h3>Consumer</h3>
            <p>Find and purchase discounted food near you.</p>
            <button
              className="btn btn-primary"
              onClick={() => handleRoleSelect("consumer")}
            >
              Select
            </button>
          </div>
          <div className="role-card">
            <div className="role-icon">🏪</div>
            <h3>Vendor</h3>
            <p>List surplus food and reduce waste.</p>
            <button
              className="btn btn-primary"
              onClick={() => handleRoleSelect("vendor")}
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * BROWSE
 * ============================================================ */
function FoodListingPage({
  items,
  user,
  userLocation,
  viewMode,
  setViewMode,
  searchTerm,
  setSearchTerm,
  filterDietary,
  setFilterDietary,
  filterCategory,
  setFilterCategory,
  onItemClick,
  onLogout,
  setCurrentPage,
  isFavorited,
  toggleFavorite,
  unreadCount,
}) {
  const availableItems = items.filter((i) => !i.reserved && !isExpired(i));

  // Augment each item with distance from the user, then filter, then sort
  const withDistance = availableItems.map((item) => ({
    ...item,
    distanceKm: distanceKm(userLocation, { lat: item.lat, lng: item.lng }),
  }));

  const filtered = withDistance
    .filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      // Multi-select dietary filter: item must satisfy ALL selected tags
      // (e.g. "Vegan + Gluten-Free" => only items tagged with BOTH).
      const itemDiets = getDietList(item);
      const matchesDietary =
        filterDietary.length === 0 ||
        filterDietary.every((d) => itemDiets.includes(d));
      const matchesCategory =
        filterCategory === "All" || item.category === filterCategory;
      return matchesSearch && matchesDietary && matchesCategory;
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);

  const categoryOptions = [
    "All",
    "Sandwiches",
    "Wraps",
    "Pastries",
    "Beverages",
    "Desserts",
    "Salads",
    "Hot Meals",
    "Bakery",
  ];

  return (
    <div className="page-wrapper">
      <ConsumerNav
        user={user}
        onLogout={onLogout}
        setCurrentPage={setCurrentPage}
        unreadCount={unreadCount}
        current="browseItems"
      />
      <div className="hero-banner">
        <div className="hero-text">
          <h2>Hey {user.email.split("@")[0]} 👋</h2>
          <p>Fresh deals near you — save food, save money.</p>
        </div>
        <div className="hero-emojis">🥗 🍕 🥐 🍔</div>
      </div>

      <div className="listing-container">
        {/* Location chip — tap to change delivery / pickup area. Mimics food-delivery apps. */}
        <button
          className="location-chip"
          onClick={() => setCurrentPage("locationPicker")}
        >
          <span className="loc-icon">📍</span>
          <span className="loc-label">
            <small>Pickup location</small>
            <strong>{userLocation.label || nearestCityLabel(userLocation)}</strong>
          </span>
          <span className="loc-change">Change ›</span>
        </button>

        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search for food..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-section">
          <div className="filter-wrap">
            <label>Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              {categoryOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dietary multi-select chips */}
        <div className="filter-wrap" style={{ marginBottom: 16 }}>
          <label>Dietary preferences</label>
          <div className="diet-multi">
            {DIETARY_OPTIONS.map((d) => {
              const active = filterDietary.includes(d);
              return (
                <button
                  key={d}
                  type="button"
                  className={`diet-multi-chip ${active ? "active" : ""}`}
                  onClick={() =>
                    setFilterDietary(
                      active
                        ? filterDietary.filter((x) => x !== d)
                        : [...filterDietary, d]
                    )
                  }
                >
                  {d}
                </button>
              );
            })}
            {filterDietary.length > 0 && (
              <button
                type="button"
                className="diet-multi-chip clear"
                onClick={() => setFilterDietary([])}
              >
                ✕ Clear
              </button>
            )}
          </div>
        </div>

        {/* View toggle: List vs Map */}
        <div className="view-toggle">
          <button
            className={`view-toggle-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
          >
            ☰ List
          </button>
          <button
            className={`view-toggle-btn ${viewMode === "map" ? "active" : ""}`}
            onClick={() => setViewMode("map")}
          >
            📍 Map
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🍽️</div>
            <h3>No items match your preferences</h3>
            <p>Try adjusting your filters or check back later.</p>
          </div>
        ) : viewMode === "map" ? (
          <MapView
            items={filtered}
            userLocation={userLocation}
            onItemClick={onItemClick}
          />
        ) : (
          <div className="items-grid">
            {filtered.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                onClick={() => onItemClick(item)}
                isFavorited={isFavorited(item.id)}
                onFavorite={() => toggleFavorite(item)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FoodCard({ item, onClick, isFavorited, onFavorite }) {
  const currentPrice = calculateDynamicPrice(
    item.basePrice,
    item.createdAt,
    item.expiryMinutes
  );
  const discount = getDiscountPercentage(item.basePrice, currentPrice);
  const timeLeft = formatTimeRemaining(item);
  const minsLeft = minutesRemaining(item);
  const emoji = getFoodEmoji(item.name, item.category);
  const gradient = getCategoryGradient(item.category);
  const urgent = minsLeft <= 60 && minsLeft > 0;

  return (
    <div className="food-card" onClick={onClick}>
      <div
        className="food-card-image"
        style={
          item.imageData
            ? { backgroundImage: `url(${item.imageData})`, backgroundSize: "cover", backgroundPosition: "center" }
            : { background: gradient }
        }
      >
        {!item.imageData && <span className="food-emoji">{emoji}</span>}
        {discount > 0 && <span className="discount-pill">-{discount}%</span>}
        <button
          className={`favorite-btn ${isFavorited ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onFavorite();
          }}
          title="Save for later"
        >
          {isFavorited ? "❤️" : "🤍"}
        </button>
      </div>
      <div className="food-card-body">
        <h3>{item.name}</h3>
        <div className="food-card-prices">
          <span className="current-price">${currentPrice.toFixed(2)}</span>
          {item.basePrice !== currentPrice && (
            <span className="original-price">
              ${item.basePrice.toFixed(2)}
            </span>
          )}
        </div>
        <div className="food-card-meta">
          <span className={`time-chip ${urgent ? "urgent" : ""}`}>
            ⏱ {timeLeft}
          </span>
          {getDietList(item).map((d) => (
            <span
              key={d}
              className={`diet-chip diet-${d.toLowerCase().replace(/[^a-z]/g, "")}`}
            >
              {d}
            </span>
          ))}
          {item.distanceKm != null && isFinite(item.distanceKm) && (
            <span className="distance-chip">
              📍 {formatDistance(item.distanceKm)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * MAP VIEW
 *   - Pure SVG map (no external libraries / network).
 *   - Centered on the user's location with concentric range rings.
 *   - Each item plotted at its real lat/lng relative to user, scaled.
 *   - Click a marker to open its details page.
 * ============================================================ */
function MapView({ items, userLocation, onItemClick }) {
  const W = 720;
  const H = 520;
  const cx = W / 2;
  const cy = H / 2;
  // Find max distance among items to scale; floor at 1 km, cap at 8 km
  const maxKm = Math.max(
    1,
    Math.min(8, Math.max(...items.map((i) => i.distanceKm || 0)) * 1.05 || 5)
  );
  const R = Math.min(W, H) / 2 - 30;
  const kmToPx = R / maxKm;

  // Project item lat/lng to xy on the map.
  const project = (item) => {
    if (item.lat == null || item.lng == null) return { x: cx, y: cy };
    // Equirectangular projection over a small area (≤ 8 km).
    const dLat = item.lat - userLocation.lat;
    const dLng = item.lng - userLocation.lng;
    // 1° lat ≈ 111 km, 1° lng ≈ 111 * cos(lat) km
    const dyKm = dLat * 111;
    const dxKm = dLng * 111 * Math.cos((userLocation.lat * Math.PI) / 180);
    return {
      x: cx + dxKm * kmToPx,
      y: cy - dyKm * kmToPx, // y inverted (north = up)
    };
  };

  return (
    <div className="map-view">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background tiles - stylized "map" pattern */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill="#eef5e8" />
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d6e6cc" strokeWidth="1" />
          </pattern>
          <radialGradient id="rangeGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.18" />
            <stop offset="80%" stopColor="#FF6B35" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#grid)" />

        {/* Stylized "roads" for visual cue */}
        <path d={`M 0 ${cy + 60} Q ${cx} ${cy + 30} ${W} ${cy + 80}`}
          stroke="#cdb89a" strokeWidth="14" fill="none" opacity="0.5" />
        <path d={`M 0 ${cy + 60} Q ${cx} ${cy + 30} ${W} ${cy + 80}`}
          stroke="#fff" strokeWidth="2" strokeDasharray="8 8" fill="none" opacity="0.7" />
        <path d={`M ${cx - 100} 0 Q ${cx + 50} ${cy} ${cx - 60} ${H}`}
          stroke="#cdb89a" strokeWidth="12" fill="none" opacity="0.5" />
        <path d={`M ${cx - 100} 0 Q ${cx + 50} ${cy} ${cx - 60} ${H}`}
          stroke="#fff" strokeWidth="2" strokeDasharray="8 8" fill="none" opacity="0.7" />

        {/* Coverage / search radius gradient */}
        <circle cx={cx} cy={cy} r={R} fill="url(#rangeGrad)" />

        {/* Range rings + labels */}
        {[1, 3, maxKm].filter((d, i, a) => a.indexOf(d) === i && d > 0).map((km) => (
          <g key={km}>
            <circle
              cx={cx}
              cy={cy}
              r={km * kmToPx}
              fill="none"
              stroke="#FF6B35"
              strokeOpacity="0.35"
              strokeDasharray="4 6"
              strokeWidth="1.5"
            />
            <text
              x={cx}
              y={cy - km * kmToPx - 4}
              textAnchor="middle"
              fontSize="11"
              fill="#E55A23"
              fontWeight="700"
            >
              {km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(km < 10 ? 1 : 0)}km`}
            </text>
          </g>
        ))}

        {/* Item markers */}
        {items.map((item) => {
          const { x, y } = project(item);
          const emoji = getFoodEmoji(item.name, item.category);
          const price = calculateDynamicPrice(
            item.basePrice,
            item.createdAt,
            item.expiryMinutes
          );
          // Constrain inside circle
          const dx = x - cx;
          const dy = y - cy;
          const r = Math.sqrt(dx * dx + dy * dy);
          let mx = x, my = y;
          if (r > R - 22) {
            const k = (R - 22) / r;
            mx = cx + dx * k;
            my = cy + dy * k;
          }
          return (
            <g
              key={item.id}
              style={{ cursor: "pointer" }}
              onClick={() => onItemClick(item)}
            >
              {/* Pin shadow */}
              <ellipse cx={mx} cy={my + 22} rx="14" ry="4"
                fill="rgba(0,0,0,0.18)" />
              {/* Pin body */}
              <path
                d={`M ${mx} ${my + 22} L ${mx - 14} ${my} A 14 14 0 1 1 ${mx + 14} ${my} Z`}
                fill="#FF6B35"
                stroke="#fff"
                strokeWidth="2"
              />
              <circle cx={mx} cy={my} r="14" fill="#fff" />
              <text
                x={mx}
                y={my + 6}
                textAnchor="middle"
                fontSize="18"
              >
                {emoji}
              </text>
              {/* Price label */}
              <rect
                x={mx - 24}
                y={my - 38}
                width="48"
                height="18"
                rx="9"
                fill="#2C1810"
              />
              <text
                x={mx}
                y={my - 25}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="#fff"
              >
                ${price.toFixed(2)}
              </text>
            </g>
          );
        })}

        {/* User pin (always on top) */}
        <circle cx={cx} cy={cy} r="14" fill="#4285F4" stroke="#fff" strokeWidth="3" />
        <circle cx={cx} cy={cy} r="26" fill="#4285F4" fillOpacity="0.18">
          <animate attributeName="r" values="14;28;14" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="fill-opacity" values="0.4;0;0.4" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <text x={cx} y={cy + 36} textAnchor="middle" fontSize="11" fontWeight="700" fill="#1a3e7a">
          You are here
        </text>
      </svg>

      {/* Mini-list under the map showing nearest items */}
      <div className="map-nearest">
        <h4>Nearest available</h4>
        <div className="map-nearest-list">
          {items.slice(0, 5).map((item) => {
            const emoji = getFoodEmoji(item.name, item.category);
            const price = calculateDynamicPrice(
              item.basePrice,
              item.createdAt,
              item.expiryMinutes
            );
            return (
              <div
                key={item.id}
                className="map-nearest-row"
                onClick={() => onItemClick(item)}
              >
                <span className="row-emoji">{emoji}</span>
                <div className="row-name">
                  <strong>{item.name}</strong>
                  <small>{item.category} • {formatDistance(item.distanceKm)}</small>
                </div>
                <span className="row-price">${price.toFixed(2)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * DETAILS
 * ============================================================ */
function FoodItemDetailsPage({
  item,
  onReserve,
  onBack,
  isFavorited,
  toggleFavorite,
}) {
  const currentPrice = calculateDynamicPrice(
    item.basePrice,
    item.createdAt,
    item.expiryMinutes
  );
  const discount = getDiscountPercentage(item.basePrice, currentPrice);
  const timeLeft = formatTimeRemaining(item);
  const expired = isExpired(item);
  const emoji = getFoodEmoji(item.name, item.category);
  const gradient = getCategoryGradient(item.category);
  const urgent = minutesRemaining(item) <= 60 && !expired;

  return (
    <div className="page-wrapper">
      <div
        className="details-header"
        style={
          item.imageData
            ? { backgroundImage: `url(${item.imageData})`, backgroundSize: "cover", backgroundPosition: "center" }
            : { background: gradient }
        }
      >
        <button className="back-button light" onClick={onBack}>
          ← Back
        </button>
        {!item.imageData && <div className="details-emoji">{emoji}</div>}
        <button
          className={`favorite-btn big ${isFavorited ? "active" : ""}`}
          onClick={toggleFavorite}
        >
          {isFavorited ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="details-card">
        <h2>{item.name}</h2>
        <p className="details-category">
          {item.category} • {getDietList(item).join(", ") || "—"}
        </p>
        {item.lat != null && (
          <div className="vendor-pin-row">
            <span>📍</span>
            <div>
              <strong>{item.locationLabel || nearestCityLabel({ lat: item.lat, lng: item.lng })}</strong>
              <small>{item.vendorEmail}</small>
            </div>
          </div>
        )}
        <p className="details-description">
          {item.description || "No description provided."}
        </p>

        <div className="price-block">
          <div>
            <p className="label">Current Price</p>
            <p className="big-price">${currentPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className="label">Original</p>
            <p className="struck">${item.basePrice.toFixed(2)}</p>
          </div>
          {discount > 0 && <div className="save-badge">🎉 Save {discount}%</div>}
        </div>

        {expired ? (
          <div className="alert alert-danger">
            ⚠️ This item has expired and can no longer be reserved.
          </div>
        ) : urgent ? (
          <div className="alert alert-warn">
            ⏰ Only {timeLeft} left! Price drops are accelerating.
          </div>
        ) : (
          <div className="alert alert-info">
            ⏱ Expires in <strong>{timeLeft}</strong> • Price drops 15% every hour
          </div>
        )}

        <button
          className="btn btn-primary btn-large"
          onClick={onReserve}
          disabled={expired || item.reserved}
        >
          {expired
            ? "Expired"
            : item.reserved
            ? "Already Reserved"
            : "✓ Reserve Now"}
        </button>
      </div>
    </div>
  );
}

/* ============================================================
 * RESERVATION CONFIRMATION
 * ============================================================ */
function ReservationConfirmationPage({ reservation, onConfirm, onCancel }) {
  const methodLabel =
    reservation.paymentMethod === "card"
      ? `Card ending •••• ${reservation.paymentMeta?.last4 || "----"}`
      : reservation.paymentMethod === "applepay"
      ? "Apple Pay"
      : reservation.paymentMethod === "cash"
      ? "Cash on pickup"
      : "Reserved";
  const methodIcon =
    reservation.paymentMethod === "card"
      ? "💳"
      : reservation.paymentMethod === "applepay"
      ? "🍎"
      : reservation.paymentMethod === "cash"
      ? "💵"
      : "✓";

  return (
    <div className="page-wrapper confirmation-wrapper">
      <div className="confirmation-card">
        <div className="success-ring">
          <span>✓</span>
        </div>
        <h2>
          {reservation.paymentMethod === "cash"
            ? "Reservation Confirmed!"
            : "Payment Successful!"}
        </h2>
        <p>
          You've reserved <strong>{reservation.itemName}</strong>
        </p>
        <p>
          Price locked at{" "}
          <strong className="locked-price">
            ${reservation.price.toFixed(2)}
          </strong>
        </p>
        <div className="receipt-row">
          <span>{methodIcon}</span>
          <span>{methodLabel}</span>
        </div>
        <div className="button-row">
          <button className="btn btn-primary" onClick={onConfirm}>
            Back to Browse
          </button>
          <button className="btn btn-outline-danger" onClick={onCancel}>
            Cancel Reservation
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * IMPACT / PROFILE
 * ============================================================ */
function UserProfilePage({
  user,
  mealsRescued,
  moneySaved,
  co2Saved,
  onLogout,
  setCurrentPage,
  unreadCount,
}) {
  return (
    <div className="page-wrapper">
      <ConsumerNav
        user={user}
        onLogout={onLogout}
        setCurrentPage={setCurrentPage}
        unreadCount={unreadCount}
        current="profile"
      />
      <div className="container">
        <button
          className="back-button"
          onClick={() => setCurrentPage("browseItems")}
        >
          ← Back
        </button>
        <h2>Your Impact</h2>
        <p className="subtitle">Every meal rescued makes a difference.</p>
        <div className="impact-grid">
          <div className="impact-card impact-meals">
            <div className="impact-emoji">🍽️</div>
            <div className="impact-number">{mealsRescued}</div>
            <div className="impact-label">Meals Rescued</div>
          </div>
          <div className="impact-card impact-money">
            <div className="impact-emoji">💰</div>
            <div className="impact-number">${moneySaved.toFixed(2)}</div>
            <div className="impact-label">Money Saved</div>
          </div>
          <div className="impact-card impact-co2">
            <div className="impact-emoji">🌱</div>
            <div className="impact-number">{co2Saved.toFixed(1)} kg</div>
            <div className="impact-label">CO₂ Saved</div>
          </div>
        </div>
        <div className="profile-actions">
          <button
            className="profile-action-btn"
            onClick={() => setCurrentPage("history")}
          >
            <span className="pa-icon">🧾</span>
            <div>
              <strong>Reservation History</strong>
              <small>View your past purchases</small>
            </div>
            <span className="pa-chev">›</span>
          </button>
          <button
            className="profile-action-btn"
            onClick={() => setCurrentPage("editProfile")}
          >
            <span className="pa-icon">⚙️</span>
            <div>
              <strong>Edit Profile</strong>
              <small>Change email or password</small>
            </div>
            <span className="pa-chev">›</span>
          </button>
        </div>
        <div className="account-info">
          <h3>Account</h3>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Joined:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * FAVORITES
 * ============================================================ */
function FavoritesPage({
  favList,
  onItemClick,
  toggleFavorite,
  onBack,
  onLogout,
  user,
  setCurrentPage,
  unreadCount,
}) {
  return (
    <div className="page-wrapper">
      <ConsumerNav
        user={user}
        onLogout={onLogout}
        setCurrentPage={setCurrentPage}
        unreadCount={unreadCount}
        current="favorites"
      />
      <div className="container">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <h2>Saved Items ❤️</h2>
        <p className="subtitle">
          We'll alert you when prices drop on these items.
        </p>
        {favList.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💔</div>
            <h3>No favorites yet</h3>
            <p>Tap the heart icon on food to save it here.</p>
          </div>
        ) : (
          <div className="items-grid">
            {favList.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                onClick={() => onItemClick(item)}
                isFavorited={true}
                onFavorite={() => toggleFavorite(item)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * NOTIFICATIONS
 * ============================================================ */
function NotificationsPage({
  notifications,
  markAllRead,
  clearAll,
  onItemClick,
  onBack,
  onLogout,
  user,
  setCurrentPage,
  isVendor,
}) {
  return (
    <div className="page-wrapper">
      {isVendor ? (
        <nav className="navbar vendor-nav">
          <div className="nav-left">
            <span className="nav-logo">🏪</span>
            <h1>EchoEats — Vendor</h1>
          </div>
          <div className="nav-right">
            <span className="vendor-email">{user.email}</span>
            <button
              className="nav-btn"
              onClick={() => setCurrentPage("dashboard")}
              title="Home"
              style={{ color: "#fff", fontSize: 22 }}
            >
              🏠
            </button>
            <button className="btn btn-logout" onClick={onLogout}>
              Logout
            </button>
          </div>
        </nav>
      ) : (
        <ConsumerNav
          user={user}
          onLogout={onLogout}
          setCurrentPage={setCurrentPage}
          unreadCount={0}
          current="notifications"
        />
      )}
      <div className="container">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <div className="notif-header">
          <h2>Notifications 🔔</h2>
          {notifications.length > 0 && (
            <div>
              <button className="btn btn-ghost" onClick={markAllRead}>
                Mark all read
              </button>
              <button className="btn btn-ghost danger" onClick={clearAll}>
                Clear all
              </button>
            </div>
          )}
        </div>
        {notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔕</div>
            <h3>No notifications yet</h3>
            <p>
              Save items and we'll alert you when prices drop or expiry is near.
            </p>
          </div>
        ) : (
          <div className="notif-list">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`notif-card ${n.read ? "read" : ""} type-${n.type}`}
                onClick={() => onItemClick(n.itemId)}
              >
                <div className="notif-icon">
                  {n.type === "price_drop"
                    ? "💰"
                    : n.type === "last_hour"
                    ? "⏰"
                    : n.type === "reservation_received"
                    ? "🎉"
                    : "⚠️"}
                </div>
                <div className="notif-body">
                  <p>{n.message}</p>
                  <small>
                    {new Date(n.createdAt).toLocaleString()} • Tap to view
                  </small>
                </div>
                {!n.read && <div className="unread-dot" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * VENDOR DASHBOARD
 * ============================================================ */
function VendorDashboardPage({
  user,
  vendorItems,
  activeItems,
  soldItems,
  onLogout,
  setCurrentPage,
  setShowForm,
  setEditingItem,
  unreadCount = 0,
}) {
  const totalRevenue = soldItems.reduce(
    (sum, item) =>
      sum +
      calculateDynamicPrice(item.basePrice, item.createdAt, item.expiryMinutes),
    0
  );

  return (
    <div className="page-wrapper">
      <nav className="navbar vendor-nav">
        <div className="nav-left">
          <span className="nav-logo">🏪</span>
          <h1>EchoEats — Vendor</h1>
        </div>
        <div className="nav-right">
          <span className="vendor-email">{user.email}</span>
          <button
            className="nav-btn notif-btn"
            onClick={() => setCurrentPage("notifications")}
            title="Notifications"
            style={{ color: "#fff", fontSize: 22 }}
          >
            🔔
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount}</span>
            )}
          </button>
          <button
            className="nav-btn"
            onClick={() => setCurrentPage("editProfile")}
            title="Edit profile"
            style={{ color: "#fff", fontSize: 22 }}
          >
            ⚙️
          </button>
          <button className="btn btn-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>
      <div className="container">
        <div className="vendor-hero">
          <h2>
            Welcome back, <span>{user.businessName || "Vendor"}</span>
          </h2>
          <p>Manage your listings and track your impact.</p>
        </div>

        <div className="quick-actions">
          <button
            className="btn btn-primary btn-large"
            onClick={() => {
              setEditingItem(null);
              setShowForm(true);
            }}
          >
            + New Listing
          </button>
          <button
            className="btn btn-secondary btn-large"
            onClick={() => setCurrentPage("listings")}
          >
            View Listings
          </button>
        </div>

        <h3 className="section-title">Today's Performance</h3>
        <div className="metrics-grid">
          <div className="metric-card metric-green">
            <div className="metric-emoji">📋</div>
            <div className="metric-value">{vendorItems.length}</div>
            <div className="metric-label">Items Listed</div>
          </div>
          <div className="metric-card metric-orange">
            <div className="metric-emoji">✅</div>
            <div className="metric-value">{soldItems.length}</div>
            <div className="metric-label">Items Sold</div>
          </div>
          <div className="metric-card metric-gold">
            <div className="metric-emoji">💰</div>
            <div className="metric-value">${totalRevenue.toFixed(2)}</div>
            <div className="metric-label">Revenue</div>
          </div>
          <div className="metric-card metric-leaf">
            <div className="metric-emoji">🌱</div>
            <div className="metric-value">
              {(soldItems.length * 0.5).toFixed(1)} kg
            </div>
            <div className="metric-label">Waste Reduced</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * ACTIVE LISTINGS
 * ============================================================ */
function ActiveListingsPage({
  items,
  onEdit,
  onDelete,
  onMarkSold,
  onBack,
  onLogout,
  user,
}) {
  return (
    <div className="page-wrapper">
      <nav className="navbar vendor-nav">
        <div className="nav-left">
          <span className="nav-logo">🏪</span>
          <h1>Active Listings</h1>
        </div>
        <div className="nav-right">
          <span className="vendor-email">{user.email}</span>
          <button className="btn btn-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>
      <div className="container">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No listings yet</h3>
            <p>Add your first surplus food item to get started.</p>
          </div>
        ) : (
          <div className="listings-list">
            {items.map((item) => {
              const currentPrice = calculateDynamicPrice(
                item.basePrice,
                item.createdAt,
                item.expiryMinutes
              );
              const expired = isExpired(item);
              const discount = getDiscountPercentage(
                item.basePrice,
                currentPrice
              );
              const emoji = getFoodEmoji(item.name, item.category);
              const gradient = getCategoryGradient(item.category);

              return (
                <div
                  key={item.id}
                  className={`listing-card ${expired ? "expired" : ""}`}
                >
                  <div
                    className="listing-thumb"
                    style={
                      item.imageData
                        ? { backgroundImage: `url(${item.imageData})`, backgroundSize: "cover", backgroundPosition: "center" }
                        : { background: gradient }
                    }
                  >
                    {!item.imageData && <span>{emoji}</span>}
                  </div>
                  <div className="listing-info">
                    <h4>
                      {item.name}
                      {expired && (
                        <span className="status-pill expired-pill">
                          EXPIRED
                        </span>
                      )}
                      {item.reserved && !expired && (
                        <span className="status-pill sold-pill">SOLD</span>
                      )}
                    </h4>
                    <p className="price-line">
                      <span className="old">
                        ${item.basePrice.toFixed(2)}
                      </span>{" "}
                      → <span className="new">${currentPrice.toFixed(2)}</span>
                      {discount > 0 && (
                        <span className="drop"> ({discount}% off)</span>
                      )}
                    </p>
                    <p className="expiry-line">
                      {expired
                        ? "Expired"
                        : `Expires: ${formatTimeRemaining(item)}`}
                    </p>
                  </div>
                  <div className="listing-actions">
                    <button
                      className="btn btn-secondary small"
                      onClick={() => onEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-primary small"
                      onClick={() => onMarkSold(item.id)}
                      disabled={item.reserved || expired}
                    >
                      Mark Sold
                    </button>
                    <button
                      className="btn btn-danger small"
                      onClick={() => {
                        if (window.confirm(`Delete ${item.name}?`)) {
                          onDelete(item.id);
                        }
                      }}
                    >
                      Delete
                    </button>
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

/* ============================================================
 * ADD / EDIT ITEM
 * ============================================================ */
function VendorItemFormPage({
  editingItem,
  items,
  setItems,
  setShowForm,
  setEditingItem,
  userId,
  userEmail,
  setCurrentPage,
}) {
  // Default new-item location: a random spot near Manama. Vendor can override.
  const initialLocation = editingItem?.lat != null
    ? { lat: editingItem.lat, lng: editingItem.lng, label: editingItem.locationLabel || nearestCityLabel({ lat: editingItem.lat, lng: editingItem.lng }) }
    : (() => {
        const r = randomNearby(USER_DEFAULT_LOCATION, 5);
        return { lat: r.lat, lng: r.lng, label: nearestCityLabel(r) };
      })();
  const [formData, setFormData] = useState(
    editingItem || {
      name: "",
      description: "",
      basePrice: "",
      category: "Sandwiches",
      dietary: ["Vegetarian"],
      expiryMinutes: 60,
    }
  );
  const [location, setLocation] = useState(initialLocation);
  const [showLocPicker, setShowLocPicker] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (
      !formData.name ||
      !formData.description ||
      !formData.basePrice ||
      !formData.expiryMinutes
    ) {
      setError("Please fill all required fields.");
      return;
    }
    if (parseFloat(formData.basePrice) <= 0) {
      setError("Price must be greater than 0.");
      return;
    }

    if (editingItem) {
      setItems(
        items.map((i) =>
          i.id === editingItem.id
            ? {
                ...i,
                ...formData,
                basePrice: parseFloat(formData.basePrice),
                expiryMinutes: parseInt(formData.expiryMinutes, 10),
                lat: location.lat,
                lng: location.lng,
                locationLabel: location.label,
              }
            : i
        )
      );
    } else {
      const newItem = {
        id: Date.now(),
        vendorId: userId,
        vendorEmail: userEmail,
        ...formData,
        basePrice: parseFloat(formData.basePrice),
        expiryMinutes: parseInt(formData.expiryMinutes, 10),
        createdAt: new Date().toISOString(),
        reserved: false,
        lat: location.lat,
        lng: location.lng,
        locationLabel: location.label,
      };
      setItems([...items, newItem]);
    }
    setShowForm(false);
    setEditingItem(null);
    setCurrentPage("listings");
  };

  const previewEmoji = getFoodEmoji(formData.name, formData.category);
  const previewGradient = getCategoryGradient(formData.category);

  return (
    <div className="page-wrapper">
      <div className="form-container">
        <button
          className="back-button"
          onClick={() => {
            setShowForm(false);
            setEditingItem(null);
            setCurrentPage("dashboard");
          }}
        >
          ← Back
        </button>
        <h2>{editingItem ? "Edit Item" : "Add New Item"}</h2>
        <p className="subtitle">
          List surplus food — prices auto-drop 15% every hour.
        </p>

        <div
          className="preview-card"
          style={
            formData.imageData
              ? { backgroundImage: `url(${formData.imageData})`, backgroundSize: "cover", backgroundPosition: "center" }
              : { background: previewGradient }
          }
        >
          {!formData.imageData && (
            <span className="preview-emoji">{previewEmoji}</span>
          )}
          <p>Live Preview</p>
        </div>

        <form onSubmit={handleSubmit} className="vendor-form">
          {/* Photo upload - real-app style */}
          <div className="form-group">
            <label>FOOD PHOTO (optional)</label>
            <div className="image-upload">
              <input
                type="file"
                accept="image/*"
                id="vendor-image-input"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  // Simple size guard - browsers/localStorage choke around 5MB
                  if (file.size > 4 * 1024 * 1024) {
                    alert("Please choose an image under 4 MB.");
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = (ev) =>
                    setFormData({ ...formData, imageData: ev.target.result });
                  reader.readAsDataURL(file);
                }}
              />
              <label htmlFor="vendor-image-input" className="image-upload-btn">
                {formData.imageData ? "Change photo" : "📷 Upload photo"}
              </label>
              {formData.imageData && (
                <button
                  type="button"
                  className="btn btn-ghost danger"
                  onClick={() => setFormData({ ...formData, imageData: null })}
                >
                  Remove
                </button>
              )}
            </div>
            <small className="hint">
              JPG / PNG, up to 4 MB. Stored locally on your device.
            </small>
          </div>

          <div className="form-group">
            <label>ITEM NAME *</label>
            <input
              type="text"
              placeholder="e.g. Fresh Croissants"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>DESCRIPTION *</label>
            <textarea
              placeholder="Describe your food item..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="form-input"
              rows="3"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>BASE PRICE ($) *</label>
              <input
                type="number"
                step="0.01"
                placeholder="24.99"
                value={formData.basePrice}
                onChange={(e) =>
                  setFormData({ ...formData, basePrice: e.target.value })
                }
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>EXPIRY (MINUTES) *</label>
              <input
                type="number"
                placeholder="60"
                value={formData.expiryMinutes}
                onChange={(e) =>
                  setFormData({ ...formData, expiryMinutes: e.target.value })
                }
                className="form-input"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>CATEGORY</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="form-input"
              >
                <option>Sandwiches</option>
                <option>Wraps</option>
                <option>Pastries</option>
                <option>Beverages</option>
                <option>Desserts</option>
                <option>Salads</option>
                <option>Hot Meals</option>
                <option>Bakery</option>
              </select>
            </div>
            <div className="form-group">
              <label>DIETARY TAGS (select any)</label>
              <div className="diet-multi">
                {DIETARY_OPTIONS.map((d) => {
                  const list = getDietList(formData);
                  const active = list.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      className={`diet-multi-chip ${active ? "active" : ""}`}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          dietary: active
                            ? list.filter((x) => x !== d)
                            : [...list, d],
                        })
                      }
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pickup Location section — required, like real food apps */}
          <div className="form-group">
            <label>PICKUP LOCATION *</label>
            <div className="location-summary">
              <div className="loc-pin">📍</div>
              <div className="loc-text">
                <strong>{location.label}</strong>
                <small>
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </small>
              </div>
              <button
                type="button"
                className="btn btn-secondary small"
                onClick={() => setShowLocPicker((v) => !v)}
              >
                {showLocPicker ? "Done" : "Change"}
              </button>
            </div>
            {showLocPicker && (
              <InlineLocationPicker
                value={location}
                onChange={(loc) => setLocation(loc)}
              />
            )}
          </div>

          {error && <p className="error-message">{error}</p>}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingItem ? "Update Item" : "Add Item"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowForm(false);
                setEditingItem(null);
                setCurrentPage("dashboard");
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ============================================================
 * PAYMENT — Step 1: choose method
 * ============================================================ */
function PaymentMethodPage({ item, onSelectMethod, onCancel }) {
  const currentPrice = calculateDynamicPrice(
    item.basePrice,
    item.createdAt,
    item.expiryMinutes
  );
  const emoji = getFoodEmoji(item.name, item.category);

  return (
    <div className="page-wrapper checkout-wrapper">
      <div className="checkout-card">
        <button className="back-button" onClick={onCancel}>
          ← Cancel
        </button>
        <h2>Checkout</h2>
        <p className="subtitle">How would you like to pay?</p>

        <div className="order-summary">
          <div className="order-emoji">{emoji}</div>
          <div className="order-info">
            <h4>{item.name}</h4>
            <p>{item.category} • {getDietList(item).join(", ") || "—"}</p>
          </div>
          <div className="order-price">${currentPrice.toFixed(2)}</div>
        </div>

        <div className="pay-methods">
          <button
            className="pay-method"
            onClick={() => onSelectMethod("cash")}
          >
            <span className="pay-icon">💵</span>
            <div>
              <strong>Cash</strong>
              <small>Pay on pickup</small>
            </div>
            <span className="chevron">›</span>
          </button>

          <button
            className="pay-method"
            onClick={() => onSelectMethod("card")}
          >
            <span className="pay-icon">💳</span>
            <div>
              <strong>Credit / Debit Card</strong>
              <small>Visa, Mastercard, Amex</small>
            </div>
            <span className="chevron">›</span>
          </button>

          <button
            className="pay-method pay-applepay"
            onClick={() => onSelectMethod("applepay")}
          >
            <span className="pay-icon">🍎</span>
            <div>
              <strong>Apple Pay</strong>
              <small>Authenticate with Face ID</small>
            </div>
            <span className="chevron">›</span>
          </button>
        </div>

        <p className="pay-disclaimer">
          🔒 This is a demo — no real charges are made.
        </p>
      </div>
    </div>
  );
}

/* ============================================================
 * PAYMENT — Step 2: card details (if card chosen)
 * ============================================================ */
function CardEntryPage({ item, onConfirm, onBack }) {
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");

  const currentPrice = calculateDynamicPrice(
    item.basePrice,
    item.createdAt,
    item.expiryMinutes
  );

  // Detect card brand from first digits
  const detectBrand = (n) => {
    const d = n.replace(/\s/g, "");
    if (/^4/.test(d)) return "Visa";
    if (/^(5[1-5]|2[2-7])/.test(d)) return "Mastercard";
    if (/^3[47]/.test(d)) return "Amex";
    if (/^6/.test(d)) return "Discover";
    return "Card";
  };

  const formatNumber = (raw) => {
    const digits = raw.replace(/\D/g, "").slice(0, 19);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (raw) => {
    const digits = raw.replace(/\D/g, "").slice(0, 4);
    if (digits.length < 3) return digits;
    return digits.slice(0, 2) + "/" + digits.slice(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const digits = number.replace(/\s/g, "");
    if (digits.length < 13 || digits.length > 19) {
      setError("Card number must be between 13 and 19 digits.");
      return;
    }
    if (!name.trim()) {
      setError("Cardholder name is required.");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      setError("Expiry must be in MM/YY format.");
      return;
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      setError("CVV must be 3 or 4 digits.");
      return;
    }
    const [mm] = expiry.split("/").map((s) => parseInt(s, 10));
    if (mm < 1 || mm > 12) {
      setError("Invalid expiry month.");
      return;
    }
    onConfirm({
      number,
      name,
      expiry,
      cvv,
      brand: detectBrand(number),
    });
  };

  const brand = detectBrand(number);

  return (
    <div className="page-wrapper checkout-wrapper">
      <div className="checkout-card">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <h2>Card Details</h2>
        <p className="subtitle">Enter your card information securely.</p>

        {/* Card mockup */}
        <div className="card-mockup">
          <div className="card-mockup-top">
            <span className="card-chip">▦</span>
            <span className="card-brand">{brand.toUpperCase()}</span>
          </div>
          <div className="card-mockup-number">
            {number || "•••• •••• •••• ••••"}
          </div>
          <div className="card-mockup-bottom">
            <div>
              <small>CARDHOLDER</small>
              <span>{name.toUpperCase() || "FULL NAME"}</span>
            </div>
            <div>
              <small>EXPIRES</small>
              <span>{expiry || "MM/YY"}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card-form">
          <div className="form-group">
            <label>CARD NUMBER</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="1234 5678 9012 3456"
              value={number}
              onChange={(e) => setNumber(formatNumber(e.target.value))}
              className="form-input"
              autoComplete="cc-number"
            />
          </div>
          <div className="form-group">
            <label>CARDHOLDER NAME</label>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              autoComplete="cc-name"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>EXPIRY (MM/YY)</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="12/28"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                className="form-input"
                autoComplete="cc-exp"
              />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input
                type="password"
                inputMode="numeric"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                className="form-input"
                autoComplete="cc-csc"
              />
            </div>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn btn-primary btn-large">
            Pay ${currentPrice.toFixed(2)}
          </button>
          <p className="pay-disclaimer">
            🔒 Demo mode — card data is not stored or transmitted.
          </p>
        </form>
      </div>
    </div>
  );
}

/* ============================================================
 * PAYMENT — Step 3: fake authentication / processing
 * Uses useEffect so onComplete fires exactly ONCE per mount,
 * regardless of re-renders triggered by the 1-second tick.
 * ============================================================ */
function ProcessingPage({ label, sub, emoji = "⏳", delay = 1500, onComplete }) {
  useEffect(() => {
    const id = setTimeout(() => {
      if (typeof onComplete === "function") onComplete();
    }, delay);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page-wrapper processing-wrapper">
      <div className="processing-card">
        <div className="processing-emoji">{emoji}</div>
        <div className="spinner" />
        <h2>{label}</h2>
        {sub && <p className="processing-sub">{sub}</p>}
      </div>
    </div>
  );
}

/* ============================================================
 * LOCATION PICKER (page + inline)
 *   - "Use my current location" button (browser geolocation)
 *   - Preset city buttons (Manama, Dubai, Doha, etc.)
 *   - Click on the mini-map to drop a pin manually
 *   - Auto-detected nearest-city label
 * ============================================================ */
function LocationPickerPage({ title, subtitle, initial, onConfirm, onCancel }) {
  const [loc, setLoc] = useState(
    initial || { lat: USER_DEFAULT_LOCATION.lat, lng: USER_DEFAULT_LOCATION.lng, label: USER_DEFAULT_LOCATION.label }
  );
  return (
    <div className="page-wrapper checkout-wrapper">
      <div className="checkout-card location-picker-card">
        <button className="back-button" onClick={onCancel}>
          ← Cancel
        </button>
        <h2>{title}</h2>
        <p className="subtitle">{subtitle}</p>

        <InlineLocationPicker value={loc} onChange={setLoc} />

        <button
          className="btn btn-primary btn-large"
          onClick={() => onConfirm(loc)}
          style={{ marginTop: 20 }}
        >
          Confirm Location
        </button>
      </div>
    </div>
  );
}

/* InlineLocationPicker — drop into any form. */
function InlineLocationPicker({ value, onChange }) {
  const loc = value || {
    lat: USER_DEFAULT_LOCATION.lat,
    lng: USER_DEFAULT_LOCATION.lng,
    label: USER_DEFAULT_LOCATION.label,
  };
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const W = 400, H = 280;
  const cx = W / 2, cy = H / 2;
  // Map is centered on the user's "default" location with a fixed
  // ~12km horizontal span. Allows reasonable drop-pin precision.
  const SPAN_KM = 12;
  const KM_PER_LAT = 111;
  const km_per_lng = 111 * Math.cos((USER_DEFAULT_LOCATION.lat * Math.PI) / 180);
  const pxPerKm = (W / 2) / (SPAN_KM / 2);

  const projectToXY = (l) => ({
    x: cx + ((l.lng - USER_DEFAULT_LOCATION.lng) * km_per_lng) * pxPerKm,
    y: cy - ((l.lat - USER_DEFAULT_LOCATION.lat) * KM_PER_LAT) * pxPerKm,
  });
  const projectToLatLng = (x, y) => ({
    lat: USER_DEFAULT_LOCATION.lat + ((cy - y) / pxPerKm) / KM_PER_LAT,
    lng: USER_DEFAULT_LOCATION.lng + ((x - cx) / pxPerKm) / km_per_lng,
  });

  const handleSvgClick = (e) => {
    const svg = e.currentTarget;
    const r = svg.getBoundingClientRect();
    const sx = (e.clientX - r.left) * (W / r.width);
    const sy = (e.clientY - r.top) * (H / r.height);
    const newLatLng = projectToLatLng(sx, sy);
    const next = {
      lat: +newLatLng.lat.toFixed(6),
      lng: +newLatLng.lng.toFixed(6),
      label: nearestCityLabel(newLatLng),
    };
    onChange(next);
  };

  const useGPS = () => {
    if (!navigator.geolocation) {
      setErr("Geolocation is not supported in this browser.");
      return;
    }
    setBusy(true);
    setErr("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = {
          lat: +pos.coords.latitude.toFixed(6),
          lng: +pos.coords.longitude.toFixed(6),
        };
        next.label = nearestCityLabel(next);
        onChange(next);
        setBusy(false);
      },
      (e) => {
        setErr("Couldn't get your location: " + e.message);
        setBusy(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const pin = projectToXY(loc);

  return (
    <div className="loc-picker">
      <div className="loc-row">
        <button
          type="button"
          className="btn btn-primary loc-gps"
          onClick={useGPS}
          disabled={busy}
        >
          {busy ? "Getting location…" : "📍 Use my current location"}
        </button>
      </div>

      <div className="loc-presets">
        <small>Or pick a city:</small>
        <div className="loc-preset-chips">
          {PRESET_CITIES.map((c) => (
            <button
              key={c.label}
              type="button"
              className={`loc-preset-chip ${loc.label === c.label ? "active" : ""}`}
              onClick={() =>
                onChange({ lat: c.lat, lng: c.lng, label: c.label })
              }
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="loc-map-wrap">
        <small>Or click on the map to drop a pin:</small>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          onClick={handleSvgClick}
          className="loc-svg"
        >
          <defs>
            <pattern id="lp-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <rect width="32" height="32" fill="#eef5e8" />
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#d6e6cc" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width={W} height={H} fill="url(#lp-grid)" />
          {/* Stylised roads */}
          <path d={`M 0 ${cy + 30} Q ${cx} ${cy + 5} ${W} ${cy + 50}`}
            stroke="#cdb89a" strokeWidth="10" fill="none" opacity="0.5" />
          <path d={`M 0 ${cy + 30} Q ${cx} ${cy + 5} ${W} ${cy + 50}`}
            stroke="#fff" strokeWidth="2" strokeDasharray="6 6" fill="none" opacity="0.7" />
          <path d={`M ${cx - 60} 0 Q ${cx + 30} ${cy} ${cx - 40} ${H}`}
            stroke="#cdb89a" strokeWidth="9" fill="none" opacity="0.5" />
          <path d={`M ${cx - 60} 0 Q ${cx + 30} ${cy} ${cx - 40} ${H}`}
            stroke="#fff" strokeWidth="2" strokeDasharray="6 6" fill="none" opacity="0.7" />
          {/* Drop pin */}
          <ellipse cx={pin.x} cy={pin.y + 18} rx="11" ry="3" fill="rgba(0,0,0,0.18)" />
          <path
            d={`M ${pin.x} ${pin.y + 18} L ${pin.x - 12} ${pin.y} A 12 12 0 1 1 ${pin.x + 12} ${pin.y} Z`}
            fill="#FF6B35"
            stroke="#fff"
            strokeWidth="2"
          />
          <circle cx={pin.x} cy={pin.y} r="6" fill="#fff" />
        </svg>
      </div>

      <div className="loc-current">
        <div>
          <strong>{loc.label || nearestCityLabel(loc)}</strong>
          <small>{loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}</small>
        </div>
      </div>

      {err && <p className="error-message">{err}</p>}
    </div>
  );
}

/* ============================================================
 * RESERVATION HISTORY (consumer)
 * ============================================================ */
function ReservationHistoryPage({
  reservations,
  items,
  onItemClick,
  onBack,
  onLogout,
  user,
  setCurrentPage,
  unreadCount,
}) {
  const totalSpent = reservations.reduce((s, r) => s + (r.price || 0), 0);
  const methodLabel = (r) =>
    r.paymentMethod === "card"
      ? `Card ${r.paymentMeta?.last4 ? `•••• ${r.paymentMeta.last4}` : ""}`
      : r.paymentMethod === "applepay"
      ? "Apple Pay"
      : r.paymentMethod === "cash"
      ? "Cash on pickup"
      : "Reserved";
  const methodIcon = (r) =>
    r.paymentMethod === "card"
      ? "💳"
      : r.paymentMethod === "applepay"
      ? "🍎"
      : r.paymentMethod === "cash"
      ? "💵"
      : "✓";

  return (
    <div className="page-wrapper">
      <ConsumerNav
        user={user}
        onLogout={onLogout}
        setCurrentPage={setCurrentPage}
        unreadCount={unreadCount}
        current="history"
      />
      <div className="container">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <h2>Reservation History 🧾</h2>
        <p className="subtitle">
          {reservations.length} reservation{reservations.length === 1 ? "" : "s"} • $
          {totalSpent.toFixed(2)} total
        </p>

        {reservations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🧾</div>
            <h3>No reservations yet</h3>
            <p>Your past purchases will show up here.</p>
          </div>
        ) : (
          <div className="history-list">
            {reservations.map((r) => {
              const item = items.find((i) => i.id === r.itemId);
              const emoji = item
                ? getFoodEmoji(r.itemName, item.category)
                : "🍽️";
              const grad = item
                ? getCategoryGradient(item.category)
                : "linear-gradient(135deg, #FF6B35, #F7931E)";
              return (
                <div
                  key={r.id}
                  className="history-card"
                  onClick={() => onItemClick(r.itemId)}
                >
                  <div
                    className="history-thumb"
                    style={
                      item?.imageData
                        ? {
                            backgroundImage: `url(${item.imageData})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }
                        : { background: grad }
                    }
                  >
                    {!item?.imageData && <span>{emoji}</span>}
                  </div>
                  <div className="history-info">
                    <h4>{r.itemName}</h4>
                    <p className="history-date">
                      {new Date(r.reservedAt).toLocaleString()}
                    </p>
                    <p className="history-method">
                      <span>{methodIcon(r)}</span> {methodLabel(r)}
                    </p>
                  </div>
                  <div className="history-price">
                    <span className="hp-amount">
                      ${(typeof r.price === "number" ? r.price : 0).toFixed(2)}
                    </span>
                    <span className="hp-label">paid</span>
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

/* ============================================================
 * EDIT PROFILE (consumer + vendor)
 * ============================================================ */
function EditProfilePage({ user, users, onSave, onBack }) {
  const [email, setEmail] = useState(user.email);
  const [businessName, setBusinessName] = useState(user.businessName || "");
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [error, setError] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    setError("");

    // Verify current password
    const me = users.find((u) => u.id === user.id);
    if (!me || me.password !== currentPwd) {
      setError("Current password is incorrect.");
      return;
    }

    // Email validation
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }
    if (
      email !== user.email &&
      users.find((u) => u.email === email && u.id !== user.id)
    ) {
      setError("That email is already in use by another account.");
      return;
    }

    // Password rules — only enforce if changing
    let nextPassword = me.password;
    if (newPwd || confirmPwd) {
      if (
        newPwd.length < 8 ||
        !/[a-zA-Z]/.test(newPwd) ||
        !/[0-9]/.test(newPwd)
      ) {
        setError(
          "New password must be at least 8 characters with letters and numbers."
        );
        return;
      }
      if (newPwd !== confirmPwd) {
        setError("New passwords don't match.");
        return;
      }
      nextPassword = newPwd;
    }

    onSave({
      ...user,
      email,
      businessName: businessName || user.businessName,
      password: nextPassword,
    });
  };

  return (
    <div className="page-wrapper">
      <div className="form-container">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <h2>Edit Profile</h2>
        <p className="subtitle">Update your account details below.</p>

        <form onSubmit={handleSave} className="vendor-form">
          <div className="form-group">
            <label>EMAIL</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {user.role === "vendor" && (
            <div className="form-group">
              <label>BUSINESS NAME</label>
              <input
                type="text"
                className="form-input"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label>CURRENT PASSWORD *</label>
            <input
              type="password"
              className="form-input"
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
              placeholder="Verify it's really you"
            />
          </div>

          <div className="section-title" style={{ fontSize: 14, margin: "8px 0 4px" }}>
            Change password (optional)
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>NEW PASSWORD</label>
              <input
                type="password"
                className="form-input"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="form-group">
              <label>CONFIRM NEW PASSWORD</label>
              <input
                type="password"
                className="form-input"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
            <button type="button" className="btn btn-secondary" onClick={onBack}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ============================================================
 * FORGOT PASSWORD
 * Two-step: enter email, then set a new password.
 * (No real email verification since the project is local-only.)
 * ============================================================ */
function ForgotPasswordPage({ setCurrentPage, users, setUsers }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [error, setError] = useState("");

  const handleVerifyEmail = (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    const account = users.find((u) => u.email === email.trim());
    if (!account) {
      setError("No account found with that email.");
      return;
    }
    setStep(2);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setError("");
    if (
      newPwd.length < 8 ||
      !/[a-zA-Z]/.test(newPwd) ||
      !/[0-9]/.test(newPwd)
    ) {
      setError(
        "Password must be at least 8 characters with letters and numbers."
      );
      return;
    }
    if (newPwd !== confirmPwd) {
      setError("Passwords don't match.");
      return;
    }
    setUsers(
      users.map((u) => (u.email === email ? { ...u, password: newPwd } : u))
    );
    setStep(3);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <button
          className="back-button"
          onClick={() => setCurrentPage("login")}
        >
          ← Back to Log In
        </button>
        <div className="auth-logo">🔑</div>
        <h2>Forgot Password</h2>

        {step === 1 && (
          <>
            <p className="subtitle">
              Enter the email associated with your account.
            </p>
            <form onSubmit={handleVerifyEmail} className="auth-form">
              <div className="form-group">
                <label>EMAIL</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="btn btn-primary btn-large">
                Continue
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <p className="subtitle">
              Set a new password for <strong>{email}</strong>.
            </p>
            <form onSubmit={handleResetPassword} className="auth-form">
              <div className="form-group">
                <label>NEW PASSWORD</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>CONFIRM NEW PASSWORD</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                />
              </div>
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="btn btn-primary btn-large">
                Reset Password
              </button>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <div className="success-ring" style={{ width: 64, height: 64, fontSize: 32, margin: "20px auto" }}>
              <span>✓</span>
            </div>
            <h2 style={{ textAlign: "center", marginBottom: 8 }}>
              Password reset!
            </h2>
            <p className="subtitle" style={{ textAlign: "center" }}>
              You can now log in with your new password.
            </p>
            <button
              className="btn btn-primary btn-large"
              onClick={() => setCurrentPage("login")}
            >
              Back to Log In
            </button>
          </>
        )}
      </div>
    </div>
  );
}
