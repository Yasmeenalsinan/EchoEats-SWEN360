import { BarChart3, Plus, ClipboardList, FlaskConical, DollarSign, Package, TrendingUp, Activity, ArrowRight, Bell, User } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { MobileLayout } from "../../components/MobileLayout";

const todayOverview = [
  { label: "New Listings", value: "4", icon: Package, color: "#2E7D32" },
  { label: "Reservations", value: "12", icon: ClipboardList, color: "#FF8F00" },
  { label: "Revenue", value: "$148", icon: DollarSign, color: "#1976D2" },
  { label: "Sell Rate", value: "82%", icon: TrendingUp, color: "#8E24AA" },
];

const recentActivity = [
  { id: 1, text: "Chicken Wrap reserved", amount: "+$8.50", time: "10 min ago" },
  { id: 2, text: "Pasta Box listing created", amount: "", time: "25 min ago" },
  { id: 3, text: "Bakery Bundle sold", amount: "+$12.00", time: "1 hr ago" },
  { id: 4, text: "Price updated for Salad Bowl", amount: "", time: "2 hrs ago" },
];

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="flex flex-col h-full bg-[#F9FAFB]">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-[#9CA3AF]">Vendor Dashboard</p>
              <h1 className="text-2xl font-bold text-[#111827]">Welcome Back</h1>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 hover:bg-gray-100 rounded-full">
                <Bell className="w-5 h-5 text-[#374151]" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#D32F2F] rounded-full" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <User className="w-5 h-5 text-[#374151]" />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-3">
            <ActionCard
              icon={Plus}
              label="New Listing"
              onClick={() => navigate("/vendor/create-listing")}
            />
            <ActionCard
              icon={ClipboardList}
              label="Active Listings"
              onClick={() => navigate("/vendor/active-listings")}
            />
            <ActionCard
              icon={FlaskConical}
              label="A/B Testing"
              onClick={() => navigate("/vendor/ab-testing")}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Today's Overview */}
          <section>
            <h2 className="text-lg font-semibold text-[#111827] mb-3">Today's Overview</h2>
            <div className="grid grid-cols-2 gap-3">
              {todayOverview.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="p-2 rounded-xl"
                        style={{ backgroundColor: `${item.color}15` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: item.color }} />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-[#111827]">{item.value}</p>
                    <p className="text-sm text-[#6B7280] mt-1">{item.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Revenue This Week */}
          <section className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-[#111827]">Revenue This Week</h2>
              <BarChart3 className="w-5 h-5 text-[#2E7D32]" />
            </div>

            <div className="h-36 rounded-xl bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#111827]">$842</p>
                <p className="text-sm text-[#6B7280] mt-1">Weekly revenue preview</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-[#6B7280]">Compared to last week</span>
              <span className="text-[#2E7D32] font-semibold">+14.6%</span>
            </div>
          </section>

          {/* Performance Metric */}
          <section className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-[#111827]">Performance Metric</h2>
              <Activity className="w-5 h-5 text-[#FF8F00]" />
            </div>

            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-[#6B7280]">Average sell-through rate</span>
              <span className="text-sm font-semibold text-[#111827]">82%</span>
            </div>

            <div className="w-full h-3 bg-[#E5E7EB] rounded-full overflow-hidden">
              <div className="h-full bg-[#2E7D32] rounded-full" style={{ width: "82%" }} />
            </div>

            <p className="text-xs text-[#9CA3AF] mt-2">
              Most listings are being sold before expiry.
            </p>
          </section>

          {/* Recent Activity */}
          <section className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-[#111827]">Recent Activity</h2>
              <button className="text-sm text-[#2E7D32] font-medium flex items-center gap-1">
                View all
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#F9FAFB]"
                >
                  <div>
                    <p className="text-sm font-medium text-[#111827]">{activity.text}</p>
                    <p className="text-xs text-[#9CA3AF] mt-1">{activity.time}</p>
                  </div>
                  {activity.amount ? (
                    <span className="text-sm font-semibold text-[#2E7D32]">{activity.amount}</span>
                  ) : null}
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </MobileLayout>
  );
}

function ActionCard({
  icon: Icon,
  label,
  onClick,
}: {
  icon: any;
  label: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="bg-[#F9FAFB] hover:bg-[#F3F4F6] rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-colors"
    >
      <div className="p-2 rounded-xl bg-[#E8F5E9]">
        <Icon className="w-5 h-5 text-[#2E7D32]" />
      </div>
      <span className="text-xs font-medium text-[#111827] text-center">{label}</span>
    </motion.button>
  );
}
