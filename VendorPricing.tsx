import { useState } from "react";
import { ArrowLeft, TrendingDown, DollarSign, Clock, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { MobileLayout } from "../../components/MobileLayout";

export function VendorPricing() {
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState({
    defaultCurve: "exponential",
    minPrice: 30,
    autoPause: true,
    abTesting: false,
  });

  const curves = [
    { id: "linear", name: "Linear", description: "Steady price decrease over time", icon: "📉" },
    { id: "exponential", name: "Exponential", description: "Accelerating price drops near expiry", icon: "📊" },
    { id: "stepped", name: "Stepped", description: "Price drops at specific intervals", icon: "🪜" },
  ];

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
          <h1 className="text-2xl font-bold text-[#111827]">Pricing & Strategy</h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Default Pricing Curve */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] mb-6">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">
              Default Pricing Curve
            </h3>
            <p className="text-xs text-[#9CA3AF] mb-4">
              Choose how prices decrease as expiration approaches
            </p>
            
            <div className="space-y-3">
              {curves.map((curve) => (
                <motion.button
                  key={curve.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSettings({ ...settings, defaultCurve: curve.id })}
                  className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 transition-all ${
                    settings.defaultCurve === curve.id
                      ? "border-[#2E7D32] bg-[#E8F5E9]"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <span className="text-2xl">{curve.icon}</span>
                  <div className="flex-1 text-left">
                    <h4 className={`text-sm font-semibold ${
                      settings.defaultCurve === curve.id ? "text-[#2E7D32]" : "text-[#111827]"
                    }`}>
                      {curve.name}
                    </h4>
                    <p className="text-xs text-[#9CA3AF]">{curve.description}</p>
                  </div>
                  {settings.defaultCurve === curve.id && (
                    <div className="w-5 h-5 bg-[#2E7D32] rounded-full flex items-center justify-center text-white text-xs">
                      ✓
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Minimum Price */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] mb-6">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">
              Minimum Acceptable Price
            </h3>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#9CA3AF]">Never go below</span>
              <span className="text-lg font-bold text-[#2E7D32]">
                {settings.minPrice}% of original
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="70"
              value={settings.minPrice}
              onChange={(e) =>
                setSettings({ ...settings, minPrice: parseInt(e.target.value) })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2E7D32]"
            />
            <div className="flex justify-between text-xs text-[#9CA3AF] mt-2">
              <span>10%</span>
              <span>70%</span>
            </div>
          </div>

          {/* Automation */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] mb-6">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">Automation</h3>
            
            <AutomationToggle
              icon={Clock}
              title="Auto-Pause at Closing"
              description="Automatically pause listings when you close"
              enabled={settings.autoPause}
              onToggle={() => setSettings({ ...settings, autoPause: !settings.autoPause })}
            />
            
            <AutomationToggle
              icon={BarChart3}
              title="A/B Testing"
              description="Test different pricing strategies"
              enabled={settings.abTesting}
              onToggle={() => setSettings({ ...settings, abTesting: !settings.abTesting })}
            />
          </div>

          {/* Info */}
          <div className="bg-[#FFF4E5] rounded-2xl p-4">
            <div className="flex gap-3">
              <TrendingDown className="w-5 h-5 text-[#FFA000] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-[#FF6B35] mb-1">
                  Pricing Tips
                </h4>
                <p className="text-xs text-[#FFA000]">
                  Exponential curves work best for highly perishable items. Stepped curves create urgency through clear discounts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

function AutomationToggle({
  icon: Icon,
  title,
  description,
  enabled,
  onToggle,
}: {
  icon: typeof Clock;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-b-0">
      <div className="p-2 bg-[#F9FAFB] rounded-lg mt-1">
        <Icon className="w-5 h-5 text-[#374151]" />
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
