import {
  calculateDynamicPrice,
  getDiscountPercentage,
  isExpired,
  minutesRemaining,
  formatTimeRemaining,
  distanceKm,
  formatDistance,
  nearestCityLabel,
  getDietList,
  getFoodEmoji,
  getCategoryGradient,
  randomNearby,
} from "./App";

const minutesAgo = (m) => new Date(Date.now() - m * 60 * 1000).toISOString();

describe("calculateDynamicPrice", () => {
  test("equals base when item is fresh", () => {
    expect(calculateDynamicPrice(10, new Date().toISOString(), 120)).toBeCloseTo(10, 1);
  });

  test("drops 15% after 1 hour", () => {
    expect(calculateDynamicPrice(10, minutesAgo(60), 120)).toBeCloseTo(8.5, 1);
  });

  test("compounds after 2 hours", () => {
    expect(calculateDynamicPrice(10, minutesAgo(120), 240)).toBeCloseTo(7.23, 1);
  });

  test("hits the 20% floor on very old items", () => {
    expect(calculateDynamicPrice(10, minutesAgo(60 * 24), 60 * 30)).toBeCloseTo(2, 2);
  });

  test("never goes below the floor", () => {
    const p = calculateDynamicPrice(50, minutesAgo(60 * 24 * 7), 60 * 30);
    expect(p).toBeGreaterThanOrEqual(50 * 0.2);
  });
});

describe("getDiscountPercentage", () => {
  test("0% when prices match", () => {
    expect(getDiscountPercentage(10, 10)).toBe(0);
  });

  test("50% when current is half of base", () => {
    expect(getDiscountPercentage(10, 5)).toBe(50);
  });

  test("rounds to a whole number", () => {
    expect(getDiscountPercentage(10, 7.34)).toBe(27);
  });

  test("never negative", () => {
    expect(getDiscountPercentage(10, 12)).toBe(0);
  });

  test("100% when current is 0", () => {
    expect(getDiscountPercentage(10, 0)).toBe(100);
  });
});

describe("isExpired and minutesRemaining", () => {
  test("not expired before time runs out", () => {
    const item = { createdAt: minutesAgo(30), expiryMinutes: 60 };
    expect(isExpired(item)).toBe(false);
  });

  test("expired after time runs out", () => {
    const item = { createdAt: minutesAgo(120), expiryMinutes: 60 };
    expect(isExpired(item)).toBe(true);
  });

  test("minutes remaining is positive when active", () => {
    const item = { createdAt: minutesAgo(20), expiryMinutes: 60 };
    expect(minutesRemaining(item)).toBeGreaterThan(0);
  });

  test("minutes remaining is 0 when expired", () => {
    const item = { createdAt: minutesAgo(120), expiryMinutes: 60 };
    expect(minutesRemaining(item)).toBe(0);
  });
});

describe("formatTimeRemaining", () => {
  test("returns Expired when out of time", () => {
    const item = { createdAt: minutesAgo(120), expiryMinutes: 60 };
    expect(formatTimeRemaining(item)).toBe("Expired");
  });

  test("uses h, m, s when over an hour", () => {
    const item = { createdAt: new Date().toISOString(), expiryMinutes: 130 };
    expect(formatTimeRemaining(item)).toMatch(/^2h \d{2}m \d{2}s$/);
  });

  test("uses m and s when under an hour", () => {
    const item = { createdAt: new Date().toISOString(), expiryMinutes: 30 };
    expect(formatTimeRemaining(item)).toMatch(/^\d{1,2}m \d{2}s$/);
  });
});

describe("distanceKm", () => {
  const manama = { lat: 26.2235, lng: 50.5876 };
  const dubai = { lat: 25.2048, lng: 55.2708 };

  test("0 for the same point", () => {
    expect(distanceKm(manama, manama)).toBeCloseTo(0, 3);
  });

  test("Manama to Dubai is around 480 km", () => {
    const d = distanceKm(manama, dubai);
    expect(d).toBeGreaterThan(450);
    expect(d).toBeLessThan(510);
  });

  test("A to B equals B to A", () => {
    expect(distanceKm(manama, dubai)).toBeCloseTo(distanceKm(dubai, manama), 3);
  });

  test("Infinity when an argument is missing", () => {
    expect(distanceKm(null, dubai)).toBe(Infinity);
  });
});

describe("formatDistance", () => {
  test("under 1 km in meters", () => {
    expect(formatDistance(0.5)).toBe("500 m");
  });

  test("1 to 10 km with one decimal", () => {
    expect(formatDistance(2.5)).toBe("2.5 km");
  });

  test("over 10 km rounded to whole", () => {
    expect(formatDistance(15.7)).toBe("16 km");
  });

  test("em dash for Infinity", () => {
    expect(formatDistance(Infinity)).toBe("—");
  });
});

describe("nearestCityLabel", () => {
  test("identifies Manama", () => {
    expect(nearestCityLabel({ lat: 26.22, lng: 50.59 })).toBe("Manama, Bahrain");
  });

  test("identifies Dubai", () => {
    expect(nearestCityLabel({ lat: 25.2, lng: 55.27 })).toBe("Dubai, UAE");
  });

  test("returns Custom location for far away points", () => {
    expect(nearestCityLabel({ lat: 0, lng: 0 })).toBe("Custom location");
  });

  test("returns Custom location for null", () => {
    expect(nearestCityLabel(null)).toBe("Custom location");
  });
});

describe("randomNearby", () => {
  const center = { lat: 26.2235, lng: 50.5876 };

  test("stays within the requested radius", () => {
    for (let i = 0; i < 50; i++) {
      expect(distanceKm(center, randomNearby(center, 5))).toBeLessThanOrEqual(5.5);
    }
  });

  test("returns a different point each call", () => {
    const a = randomNearby(center, 5);
    const b = randomNearby(center, 5);
    expect(a.lat !== b.lat || a.lng !== b.lng).toBe(true);
  });
});

describe("getDietList", () => {
  test("empty array when no dietary set", () => {
    expect(getDietList({})).toEqual([]);
  });

  test("wraps a single string in an array", () => {
    expect(getDietList({ dietary: "Vegan" })).toEqual(["Vegan"]);
  });

  test("returns the array unchanged", () => {
    expect(getDietList({ dietary: ["Vegan", "Halal"] })).toEqual(["Vegan", "Halal"]);
  });
});

describe("getFoodEmoji", () => {
  test("matches by food keyword", () => {
    expect(getFoodEmoji("Fresh Croissant", "Pastries")).toBe("🥐");
    expect(getFoodEmoji("Margherita Pizza", "Hot Meals")).toBe("🍕");
    expect(getFoodEmoji("Chicken Sandwich", "Sandwiches")).toBe("🥪");
  });

  test("falls back to category emoji", () => {
    expect(getFoodEmoji("Mystery Item", "Bakery")).toBe("🍞");
  });

  test("default plate when nothing matches", () => {
    expect(getFoodEmoji("Random", "")).toBe("🍽️");
  });

  test("case insensitive on names", () => {
    expect(getFoodEmoji("PIZZA SUPREME", "Hot Meals")).toBe("🍕");
  });
});

describe("getCategoryGradient", () => {
  test("returns a gradient for a known category", () => {
    expect(getCategoryGradient("Pastries")).toContain("linear-gradient");
  });

  test("returns a fallback gradient for unknown", () => {
    expect(getCategoryGradient("Unknown")).toContain("linear-gradient");
  });
});
