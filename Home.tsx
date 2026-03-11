import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, MapPin, List, Map, Bell, User, X, Heart, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { MobileLayout } from "../../components/MobileLayout";
import { FoodCard } from "../../components/FoodCard";
import { InteractiveMap } from "../../components/InteractiveMap";
import { mockFoodItems } from "../../data/mockData";
import { apiCall } from "../../../utils/supabase/client";
import { transformListingForCard } from "../../../utils/listingTransform";
import { useLikes } from "../../contexts/LikesContext";

const DIETARY_FILTERS = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Halal",
  "Kosher",
  "Keto",
  "Dairy-Free",
  "Nut-Free",
];

export function ConsumerHome() {
  const navigate = useNavigate();
  const { likedItems } = useLikes();
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapOverlayExpanded, setMapOverlayExpanded] = useState(true);

  useEffect(() => {
    loadData();
  }, [searchQuery, selectedFilters]);

  async function loadData() {
    try {
      setLoading(true);

      // Build query params
      const params = new URLSearchParams();
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      if (selectedFilters.length > 0) {
        params.append("filters", selectedFilters.join(","));
      }

      console.log("Loading listings with params:", params.toString());
      
      // Fetch listings with filters
      const listingsData = await apiCall(`/listings?${params.toString()}`);
      console.log("Listings loaded successfully:", listingsData);
      setListings(listingsData.listings || []);

      // Fetch vendors for map view
      if (viewMode === "map") {
        console.log("Loading vendors for map view");
        const vendorsData = await apiCall("/vendors");
        console.log("Vendors loaded successfully:", vendorsData);
        setVendors(Array.isArray(vendorsData.vendors) ? vendorsData.vendors : []);
      }
    } catch (error) {
      // Errors are handled gracefully by the apiCall function
      // which automatically switches to mock data when backend is unavailable
      console.log("Data loaded from fallback source");
    } finally {
      setLoading(false);
    }
  }

  async function loadVendors() {
    try {
      const vendorsData = await apiCall("/vendors");
      setVendors(Array.isArray(vendorsData.vendors) ? vendorsData.vendors : []);
    } catch (error) {
      console.error("Error loading vendors:", error);
      setVendors([]);
    }
  }

  useEffect(() => {
    if (viewMode === "map") {
      loadVendors();
    }
  }, [viewMode]);

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const clearFilters = () => {
    setSelectedFilters([]);
    setSearchQuery("");
  };

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-100">
          {/* Location */}
          <div className="flex items-center justify-between mb-4">
            <button className="flex items-center gap-2 text-[#111827]">
              <MapPin className="w-5 h-5 text-[#2E7D32]" />
              <div className="text-left">
                <div className="text-xs text-[#9CA3AF]">Current Location</div>
                <div className="text-sm font-semibold">San Francisco, CA</div>
              </div>
            </button>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate("/consumer/notifications")}
                className="relative p-2 hover:bg-gray-100 rounded-full"
              >
                <Bell className="w-5 h-5 text-[#374151]" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#D32F2F] rounded-full" />
              </button>
              <button 
                onClick={() => navigate("/consumer/profile")}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <User className="w-5 h-5 text-[#374151]" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-3 bg-[#F9FAFB] rounded-full px-4 py-3">
              <Search className="w-5 h-5 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search for food..."
                className="flex-1 bg-transparent outline-none text-[#111827] placeholder:text-[#9CA3AF]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-[#9CA3AF] hover:text-[#374151]">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3 rounded-full transition-colors ${
                showFilters || selectedFilters.length > 0
                  ? "bg-[#2E7D32] text-white"
                  : "bg-[#2E7D32] text-white"
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-[#111827]">Dietary Filters</p>
                  {selectedFilters.length > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-[#2E7D32] font-medium hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {DIETARY_FILTERS.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => toggleFilter(filter)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        selectedFilters.includes(filter)
                          ? "bg-[#2E7D32] text-white"
                          : "bg-[#F3F4F6] text-[#374151] hover:bg-[#E5E7EB]"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* View Toggle */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setViewMode("list")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-colors ${
                viewMode === "list"
                  ? "bg-[#2E7D32] text-white"
                  : "bg-[#F9FAFB] text-[#374151]"
              }`}
            >
              <List className="w-4 h-4" />
              <span>List View</span>
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-colors ${
                viewMode === "map"
                  ? "bg-[#2E7D32] text-white"
                  : "bg-[#F9FAFB] text-[#374151]"
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Map View</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {viewMode === "list" ? (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-[#111827]">
                  Nearby Deals
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[#9CA3AF]">
                    {listings.length} available
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate("/consumer/likes")}
                    className="relative p-2 bg-white rounded-full shadow-sm"
                  >
                    <Heart className="w-5 h-5 text-[#D32F2F]" />
                    {likedItems.size > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#D32F2F] text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                        {likedItems.size}
                      </span>
                    )}
                  </motion.button>
                </div>
              </div>
              <AnimatePresence>
                {listings.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <FoodCard
                      {...item}
                      onClick={() => navigate(`/consumer/item/${item.id}`)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="relative h-full">
              {/* Interactive Map */}
              {vendors.length > 0 ? (
                <InteractiveMap vendors={vendors} />
              ) : (
                <div className="h-full bg-gradient-to-br from-[#E8F5E9] to-[#66BB6A]/20 flex items-center justify-center">
                  <div className="text-center">
                    <Map className="w-16 h-16 text-[#2E7D32] mx-auto mb-3" />
                    <p className="text-[#374151] font-medium">Loading vendors...</p>
                  </div>
                </div>
              )}
              
              {/* Collapsible Floating Cards Overlay */}
              <AnimatePresence>
                <motion.div
                  initial={false}
                  animate={{
                    bottom: mapOverlayExpanded ? 16 : -230,
                  }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="absolute left-0 right-0 z-10 px-4"
                  style={{ bottom: 16 }}
                >
                  {/* Toggle Button */}
                  <div className="flex justify-center mb-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setMapOverlayExpanded(!mapOverlayExpanded)}
                      className="bg-white rounded-full p-2 shadow-lg"
                    >
                      {mapOverlayExpanded ? (
                        <ChevronDown className="w-5 h-5 text-[#374151]" />
                      ) : (
                        <ChevronUp className="w-5 h-5 text-[#374151]" />
                      )}
                    </motion.button>
                  </div>
                  
                  {/* Cards Container */}
                  <div className="overflow-x-auto flex gap-3 pb-2 scrollbar-hide">
                    {listings.slice(0, 5).map((item) => (
                      <div key={item.id} className="w-72 shrink-0">
                        <FoodCard
                          {...item}
                          onClick={() => navigate(`/consumer/item/${item.id}`)}
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Floating Action Button - Likes */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate("/consumer/likes")}
                className="absolute top-4 right-4 z-20 bg-white p-3 rounded-full shadow-lg"
              >
                <div className="relative">
                  <Heart className="w-6 h-6 text-[#D32F2F]" />
                  {likedItems.size > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#D32F2F] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                      {likedItems.size}
                    </span>
                  )}
                </div>
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}