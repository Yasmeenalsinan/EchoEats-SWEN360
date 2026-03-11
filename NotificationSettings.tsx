import { useState } from "react";
import { ArrowLeft, Bell, Mail, Smartphone, TrendingDown, Clock, Heart, DollarSign, Leaf } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { MobileLayout } from "../../components/MobileLayout";

export function NotificationSettings() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    pushEnabled: true,
    emailEnabled: false,
    favoriteVendors: true,
    priceDrops: true,
    expiryAlerts: true,
    nearbyDeals: false,
    reservationReminders: true,
    paymentConfirmations: true,
    weeklySummary: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
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
          <h1 className="text-2xl font-bold text-[#111827]">Notifications</h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Master Controls */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] mb-6">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">Master Controls</h3>
            
            <NotificationToggle
              icon={Smartphone}
              title="Push Notifications"
              description="Receive notifications on your device"
              enabled={settings.pushEnabled}
              onToggle={() => toggleSetting("pushEnabled")}
            />
            
            <NotificationToggle
              icon={Mail}
              title="Email Notifications"
              description="Receive notifications via email"
              enabled={settings.emailEnabled}
              onToggle={() => toggleSetting("emailEnabled")}
            />
          </div>

          {/* Deal Alerts */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] mb-6">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">Deal Alerts</h3>
            
            <NotificationToggle
              icon={Heart}
              title="Favorite Vendor Alerts"
              description="New listings from vendors you like"
              enabled={settings.favoriteVendors}
              onToggle={() => toggleSetting("favoriteVendors")}
              color="#D32F2F"
            />
            
            <NotificationToggle
              icon={TrendingDown}
              title="Price Drop Alerts"
              description="When prices drop on items you've viewed"
              enabled={settings.priceDrops}
              onToggle={() => toggleSetting("priceDrops")}
              color="#FF6B35"
            />
            
            <NotificationToggle
              icon={Clock}
              title="Last-Hour Expiry Alerts"
              description="Items expiring in the next hour"
              enabled={settings.expiryAlerts}
              onToggle={() => toggleSetting("expiryAlerts")}
              color="#FFA000"
            />
            
            <NotificationToggle
              icon={Bell}
              title="Nearby Deal Alerts"
              description="New deals within 1 mile of you"
              enabled={settings.nearbyDeals}
              onToggle={() => toggleSetting("nearbyDeals")}
              color="#2E7D32"
            />
          </div>

          {/* Transaction Notifications */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] mb-6">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">Transactions</h3>
            
            <NotificationToggle
              icon={Clock}
              title="Reservation Reminders"
              description="Pickup time and countdown reminders"
              enabled={settings.reservationReminders}
              onToggle={() => toggleSetting("reservationReminders")}
            />
            
            <NotificationToggle
              icon={DollarSign}
              title="Payment Confirmations"
              description="Receipts and payment status"
              enabled={settings.paymentConfirmations}
              onToggle={() => toggleSetting("paymentConfirmations")}
            />
          </div>

          {/* Sustainability */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] mb-6">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">Sustainability</h3>
            
            <NotificationToggle
              icon={Leaf}
              title="Weekly Impact Summary"
              description="Your weekly food waste reduction stats"
              enabled={settings.weeklySummary}
              onToggle={() => toggleSetting("weeklySummary")}
              color="#66BB6A"
            />
          </div>

          {/* Info Note */}
          <div className="bg-[#E8F5E9] rounded-2xl p-4">
            <p className="text-sm text-[#2E7D32]">
              💡 <strong>Tip:</strong> Enable Price Drop Alerts to never miss a great deal on your favorite foods!
            </p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

function NotificationToggle({
  icon: Icon,
  title,
  description,
  enabled,
  onToggle,
  color = "#374151",
}: {
  icon: typeof Bell;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  color?: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-b-0">
      <div
        className="p-2 rounded-lg mt-1"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-[#111827] mb-1">{title}</h4>
        <p className="text-xs text-[#9CA3AF]">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={`relative w-12 h-7 rounded-full transition-colors ${
          enabled ? "bg-[#2E7D32]" : "bg-gray-300"
        }`}
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
