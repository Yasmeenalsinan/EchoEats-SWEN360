import { useState } from "react";
import { ArrowLeft, Moon, MapIcon, ListIcon, DollarSign } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { MobileLayout } from "../../components/MobileLayout";

const DIETARY_OPTIONS = [
  { id: "vegetarian", label: "Vegetarian", icon: "🥗" },
  { id: "vegan", label: "Vegan", icon: "🌱" },
  { id: "halal", label: "Halal", icon: "🕌" },
  { id: "kosher", label: "Kosher", icon: "✡️" },
  { id: "gluten-free", label: "Gluten-Free", icon: "🌾" },
  { id: "dairy-free", label: "Dairy-Free", icon: "🥛" },
  { id: "keto", label: "Keto", icon: "🥑" },
  { id: "nut-free", label: "Nut-Free", icon: "🥜" },
];

export function Preferences() {
  const navigate = useNavigate();

  const [preferences, setPreferences] = useState({
    dietaryTags: ["vegetarian", "gluten-free"],
    maxDistance: 5,
    defaultView: "list",
    darkMode: false,
    autoReserve: false,
    minPrice: 0,
    maxPrice: 50,
  });

  const toggleDietaryTag = (tag: string) => {
    setPreferences({
      ...preferences,
      dietaryTags: preferences.dietaryTags.includes(tag)
        ? preferences.dietaryTags.filter((t) => t !== tag)
        : [...preferences.dietaryTags, tag],
    });
  };

  return (
    <MobileLayout>
      <div className="flex flex-col h-full bg-[#F9FAFB]">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-100">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#374151] mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-[#111827]">Preferences</h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Dietary Preferences */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] mb-6">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">
              Dietary Preferences
            </h3>
            <p className="text-xs text-[#9CA3AF] mb-4">
              Select your dietary needs to personalize your food recommendations
            </p>
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map((option) => {
                const isSelected = preferences.dietaryTags.includes(option.id);
                return (
                  <motion.button
                    key={option.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleDietaryTag(option.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                      isSelected
                        ? "border-[#2E7D32] bg-[#E8F5E9] text-[#2E7D32]"
                        : "border-gray-200 bg-white text-[#374151]"
                    }`}
                  >
                    <span>{option.icon}</span>
                    <span className="text-sm font-medium">{option.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Distance Preference */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] mb-6">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">
              Maximum Travel Distance
            </h3>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#9CA3AF]">Within</span>
              <span className="text-lg font-bold text-[#2E7D32]">
                {preferences.maxDistance} miles
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              value={preferences.maxDistance}
              onChange={(e) =>
                setPreferences({ ...preferences, maxDistance: parseInt(e.target.value) })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2E7D32]"
            />
            <div className="flex justify-between text-xs text-[#9CA3AF] mt-2">
              <span>1 mi</span>
              <span>25 mi</span>
            </div>
          </div>

          {/* Price Range */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] mb-6">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">
              Preferred Price Range
            </h3>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#9CA3AF]">Show items between</span>
              <span className="text-lg font-bold text-[#2E7D32]">
                ${preferences.minPrice} - ${preferences.maxPrice}
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[#9CA3AF] mb-2 block">Min Price</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={preferences.minPrice}
                  onChange={(e) =>
                    setPreferences({ ...preferences, minPrice: parseInt(e.target.value) })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2E7D32]"
                />
              </div>
              <div>
                <label className="text-xs text-[#9CA3AF] mb-2 block">Max Price</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={preferences.maxPrice}
                  onChange={(e) =>
                    setPreferences({ ...preferences, maxPrice: parseInt(e.target.value) })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2E7D32]"
                />
              </div>
            </div>
          </div>

          {/* View Preferences */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] mb-6">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">
              Default View Mode
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <ViewOption
                icon={ListIcon}
                label="List View"
                selected={preferences.defaultView === "list"}
                onClick={() => setPreferences({ ...preferences, defaultView: "list" })}
              />
              <ViewOption
                icon={MapIcon}
                label="Map View"
                selected={preferences.defaultView === "map"}
                onClick={() => setPreferences({ ...preferences, defaultView: "map" })}
              />
            </div>
          </div>

          {/* App Preferences */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] mb-6">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">
              App Preferences
            </h3>
            
            <ToggleOption
              icon={Moon}
              title="Dark Mode"
              description="Switch to dark theme"
              enabled={preferences.darkMode}
              onToggle={() => setPreferences({ ...preferences, darkMode: !preferences.darkMode })}
              comingSoon
            />
            
            <ToggleOption
              icon={DollarSign}
              title="Auto-Reserve Confirmation"
              description="Skip confirmation when reserving items"
              enabled={preferences.autoReserve}
              onToggle={() =>
                setPreferences({ ...preferences, autoReserve: !preferences.autoReserve })
              }
            />
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

function ViewOption({
  icon: Icon,
  label,
  selected,
  onClick,
}: {
  icon: typeof MapIcon;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
        selected
          ? "border-[#2E7D32] bg-[#E8F5E9]"
          : "border-gray-200 bg-white"
      }`}
    >
      <Icon
        className={`w-8 h-8 ${selected ? "text-[#2E7D32]" : "text-[#9CA3AF]"}`}
      />
      <span
        className={`text-sm font-medium ${
          selected ? "text-[#2E7D32]" : "text-[#374151]"
        }`}
      >
        {label}
      </span>
    </motion.button>
  );
}

function ToggleOption({
  icon: Icon,
  title,
  description,
  enabled,
  onToggle,
  comingSoon = false,
}: {
  icon: typeof Moon;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  comingSoon?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-b-0">
      <div className="p-2 bg-[#F9FAFB] rounded-lg mt-1">
        <Icon className="w-5 h-5 text-[#374151]" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-[#111827]">{title}</h4>
          {comingSoon && (
            <span className="text-xs px-2 py-0.5 bg-[#FFA000]/10 text-[#FFA000] rounded-full font-semibold">
              Soon
            </span>
          )}
        </div>
        <p className="text-xs text-[#9CA3AF] mt-1">{description}</p>
      </div>
      <button
        onClick={onToggle}
        disabled={comingSoon}
        className={`relative w-12 h-7 rounded-full transition-colors ${
          enabled ? "bg-[#2E7D32]" : "bg-gray-300"
        } ${comingSoon ? "opacity-50" : ""}`}
      >
        <motion.div
          animate={{ x: enabled ? 20 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
        />
      </button>
    </div>
  );
}
