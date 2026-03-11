import { ArrowLeft, ChevronRight, User, Bell, Heart, CreditCard, Shield, Leaf, HelpCircle, FileText, Globe, DollarSign, Smartphone, LogOut, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { MobileLayout } from "../../components/MobileLayout";
import { useAuth } from "../../context/AuthContext";

export function Settings() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

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
  const accountType = profile?.role || user?.role || "consumer";

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
          <h1 className="text-2xl font-bold text-[#111827]">Settings</h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] mb-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] rounded-full flex items-center justify-center text-white text-xl font-bold">
                {user?.name ? getInitials(user.name) : profile?.name ? getInitials(profile.name) : "U"}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[#111827]">
                  {displayName}
                </h2>
                <p className="text-sm text-[#9CA3AF]">{displayEmail}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                accountType === "vendor" 
                  ? "bg-[#FF6B35]/10 text-[#FF6B35]" 
                  : "bg-[#2E7D32]/10 text-[#2E7D32]"
              }`}>
                {accountType === "vendor" ? "🏪 Vendor" : "👤 Consumer"}
              </span>
              <button
                onClick={() => navigate("/settings/edit-profile")}
                className="text-sm font-semibold text-[#2E7D32]"
              >
                Edit Profile
              </button>
            </div>
          </motion.div>

          {/* ACCOUNT SETTINGS */}
          <SettingsSection title="ACCOUNT SETTINGS">
            <SettingItem
              icon={User}
              label="Edit Profile"
              onClick={() => navigate("/settings/edit-profile")}
            />
            <SettingItem
              icon={Shield}
              label="Privacy & Security"
              onClick={() => navigate("/settings/privacy")}
            />
            <SettingItem
              icon={Globe}
              label="Language & Region"
              onClick={() => navigate("/settings/language")}
            />
          </SettingsSection>

          {/* PREFERENCES */}
          <SettingsSection title="PREFERENCES">
            <SettingItem
              icon={Bell}
              label="Notifications"
              onClick={() => navigate("/settings/notifications")}
            />
            <SettingItem
              icon={Heart}
              label="Dietary Preferences"
              onClick={() => navigate("/settings/preferences")}
            />
            {accountType === "consumer" && (
              <SettingItem
                icon={CreditCard}
                label="Payment Methods"
                onClick={() => navigate("/settings/payments")}
              />
            )}
          </SettingsSection>

          {/* VENDOR SETTINGS - Only show for vendors */}
          {accountType === "vendor" && (
            <SettingsSection title="VENDOR SETTINGS">
              <SettingItem
                icon={DollarSign}
                label="Pricing & Strategy"
                onClick={() => navigate("/settings/vendor-pricing")}
              />
              <SettingItem
                icon={CreditCard}
                label="Payout Settings"
                onClick={() => navigate("/settings/vendor-payouts")}
              />
              <SettingItem
                icon={Smartphone}
                label="Business Settings"
                onClick={() => navigate("/settings/vendor-business")}
              />
            </SettingsSection>
          )}

          {/* SUSTAINABILITY */}
          <SettingsSection title="SUSTAINABILITY">
            <SettingItem
              icon={Leaf}
              label="Impact Dashboard"
              onClick={() => navigate("/settings/impact")}
            />
          </SettingsSection>

          {/* SUPPORT & LEGAL */}
          <SettingsSection title="SUPPORT & LEGAL">
            <SettingItem
              icon={HelpCircle}
              label="Help Center"
              onClick={() => navigate("/settings/help")}
            />
            <SettingItem
              icon={FileText}
              label="Terms & Privacy"
              onClick={() => navigate("/settings/legal")}
            />
          </SettingsSection>

          {/* DANGER ZONE */}
          <SettingsSection title="ACCOUNT ACTIONS">
            <SettingItem
              icon={LogOut}
              label="Log Out"
              onClick={async () => {
                await signOut();
                navigate("/");
              }}
              variant="danger"
            />
            <SettingItem
              icon={Trash2}
              label="Delete Account"
              onClick={() => navigate("/settings/delete-account")}
              variant="danger"
            />
          </SettingsSection>

          {/* App Version */}
          <div className="text-center py-6">
            <p className="text-xs text-[#9CA3AF]">EchoEats Version 1.0.0</p>
            <p className="text-xs text-[#9CA3AF] mt-1">© 2026 EchoEats Inc.</p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3 px-1">
        {title}
      </h3>
      <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function SettingItem({
  icon: Icon,
  label,
  onClick,
  variant = "default",
}: {
  icon: typeof User;
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
}) {
  const textColor = variant === "danger" ? "text-[#D32F2F]" : "text-[#111827]";
  const iconColor = variant === "danger" ? "text-[#D32F2F]" : "text-[#374151]";

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
    >
      <Icon className={`w-5 h-5 ${iconColor}`} />
      <span className={`flex-1 text-left font-medium ${textColor}`}>{label}</span>
      <ChevronRight className={`w-5 h-5 ${iconColor}`} />
    </motion.button>
  );
}