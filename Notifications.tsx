import { ArrowLeft, TrendingDown, Heart, Clock, MapPin, Settings } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { MobileLayout } from "../../components/MobileLayout";
import { mockNotifications } from "../../data/mockData";
import { Switch } from "../../components/ui/switch";

const notificationIcons = {
  "price-drop": TrendingDown,
  "favorite-vendor": Heart,
  "last-chance": Clock,
  nearby: MapPin,
};

const notificationColors = {
  "price-drop": "#FF6B35",
  "favorite-vendor": "#2E7D32",
  "last-chance": "#D32F2F",
  nearby: "#66BB6A",
};

export function Notifications() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate("/consumer/home")}
              className="flex items-center gap-2 text-[#374151]"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Settings className="w-5 h-5 text-[#374151]" />
            </button>
          </div>
          <h1 className="text-2xl font-bold text-[#111827]">Notifications</h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Notification Settings */}
          <div className="bg-white px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-[#111827] mb-3">
              Alert Preferences
            </h3>
            <div className="space-y-3">
              <NotificationToggle
                label="Price Drop Alerts"
                description="Get notified when prices decrease"
                defaultChecked
              />
              <NotificationToggle
                label="Favorite Vendor Alerts"
                description="New listings from your favorites"
                defaultChecked
              />
              <NotificationToggle
                label="Proximity Alerts"
                description="Deals near your location"
                defaultChecked={false}
              />
              <NotificationToggle
                label="Last Hour Alerts"
                description="Items expiring soon"
                defaultChecked
              />
            </div>
          </div>

          {/* Notifications List */}
          <div className="px-6 py-4 space-y-3">
            <h3 className="text-sm font-semibold text-[#111827] mb-3">
              Recent Notifications
            </h3>
            {mockNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <NotificationCard notification={notification} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

function NotificationToggle({
  label,
  description,
  defaultChecked,
}: {
  label: string;
  description: string;
  defaultChecked: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex-1">
        <div className="font-medium text-[#111827] text-sm">{label}</div>
        <div className="text-xs text-[#9CA3AF]">{description}</div>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}

function NotificationCard({
  notification,
}: {
  notification: (typeof mockNotifications)[0];
}) {
  const Icon = notificationIcons[notification.type as keyof typeof notificationIcons];
  const color = notificationColors[notification.type as keyof typeof notificationColors];

  return (
    <div
      className={`bg-white rounded-xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.06)] ${
        !notification.read ? "border-l-4" : ""
      }`}
      style={{ borderColor: !notification.read ? color : "transparent" }}
    >
      <div className="flex items-start gap-3">
        <div
          className="p-2 rounded-lg shrink-0"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-[#111827] mb-1">
            {notification.title}
          </h4>
          <p className="text-sm text-[#374151] mb-2">
            {notification.message}
          </p>
          <span className="text-xs text-[#9CA3AF]">{notification.time}</span>
        </div>
        {!notification.read && (
          <div className="w-2 h-2 rounded-full bg-[#2E7D32] shrink-0 mt-2" />
        )}
      </div>
    </div>
  );
}
