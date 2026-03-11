import { ArrowLeft, Award, DollarSign, Leaf, Package, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { MobileLayout } from "../../components/MobileLayout";
import { mockUserStats, mockBadges } from "../../data/mockData";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";

export function Profile() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [stats, setStats] = useState(mockUserStats);

  useEffect(() => {
    if (profile?.stats) {
      setStats(profile.stats);
    }
  }, [profile]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Prioritize profile data from database over user metadata
  const displayName = profile?.name || user?.name || "User";
  const displayEmail = profile?.email || user?.email || "";

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] px-6 py-4">
          <button
            onClick={() => navigate("/consumer/home")}
            className="flex items-center gap-2 text-white/90 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          {/* Profile Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {displayName ? getInitials(displayName) : "U"}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-1">{displayName}</h1>
              <p className="text-white/80">{displayEmail}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto -mt-4">
          {/* Stats Cards */}
          <div className="px-6 mb-6">
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
              <h3 className="text-sm font-semibold text-[#111827] mb-4">
                Your Impact
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  icon={Package}
                  label="Meals Rescued"
                  value={stats.mealsRescued.toString()}
                  color="#2E7D32"
                />
                <StatCard
                  icon={DollarSign}
                  label="Money Saved"
                  value={`$${stats.moneySaved.toFixed(0)}`}
                  color="#FF6B35"
                />
                <StatCard
                  icon={Leaf}
                  label="CO₂ Saved"
                  value={`${stats.co2Saved.toFixed(1)}kg`}
                  color="#66BB6A"
                  className="col-span-2"
                />
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="px-6 mb-6">
            <h3 className="text-sm font-semibold text-[#111827] mb-3">
              Achievements
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {mockBadges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.06)] text-center ${
                    !badge.unlocked ? "opacity-50" : ""
                  }`}
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <h4 className="font-semibold text-[#111827] text-sm mb-1">
                    {badge.name}
                  </h4>
                  <p className="text-xs text-[#9CA3AF]">{badge.description}</p>
                  {badge.unlocked && (
                    <div className="mt-2 inline-flex items-center gap-1 text-[#2E7D32] text-xs font-semibold">
                      <Award className="w-3 h-3" />
                      <span>Unlocked</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Menu Options */}
          <div className="px-6 pb-6 space-y-2">
            <MenuButton
              icon={Settings}
              label="Settings"
              onClick={() => navigate("/settings")}
            />
            <MenuButton
              icon={LogOut}
              label="Log Out"
              onClick={handleSignOut}
              variant="danger"
            />
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  className = "",
}: {
  icon: typeof Package;
  label: string;
  value: string;
  color: string;
  className?: string;
}) {
  return (
    <div className={`text-center ${className}`}>
      <div
        className="w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div className="text-2xl font-bold text-[#111827] mb-1">{value}</div>
      <div className="text-xs text-[#9CA3AF]">{label}</div>
    </div>
  );
}

function MenuButton({
  icon: Icon,
  label,
  onClick,
  variant = "default",
}: {
  icon: typeof Settings;
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
}) {
  const colorClass = variant === "danger" ? "text-[#D32F2F]" : "text-[#111827]";

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 bg-white rounded-xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:bg-gray-50 transition-colors"
    >
      <Icon className={`w-5 h-5 ${colorClass}`} />
      <span className={`flex-1 text-left font-medium ${colorClass}`}>
        {label}
      </span>
    </button>
  );
}