import { motion } from "motion/react";
import { CheckCircle2, Share2, Leaf, DollarSign, Home } from "lucide-react";
import { useNavigate } from "react-router";
import { MobileLayout } from "../../components/MobileLayout";
import { Button } from "../../components/ui/button";
import { mockFoodItems } from "../../data/mockData";

export function PaymentSuccess() {
  const navigate = useNavigate();
  const item = mockFoodItems[0];
  const savings = item.originalPrice - item.currentPrice;

  return (
    <MobileLayout>
      <div className="flex flex-col h-full justify-between px-6 py-8">
        {/* Success Animation */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="mb-6"
          >
            <CheckCircle2 className="w-24 h-24 text-[#2E7D32]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-[#111827] mb-2 text-center"
          >
            You rescued a meal!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-[#374151] text-center mb-8"
          >
            Your reservation is confirmed
          </motion.p>

          {/* Impact Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full space-y-3 mb-8"
          >
            <ImpactCard
              icon={DollarSign}
              label="Money Saved"
              value={`$${savings.toFixed(2)}`}
              color="#2E7D32"
            />
            <ImpactCard
              icon={Leaf}
              label="CO₂ Reduced"
              value={`${item.co2Saved}kg`}
              color="#66BB6A"
            />
          </motion.div>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="w-full bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
          >
            <div className="flex gap-4">
              <img
                src={item.image}
                alt={item.title}
                className="w-20 h-20 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-[#111827] mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-[#374151] mb-2">{item.vendor}</p>
                <p className="text-xs text-[#9CA3AF]">
                  Pickup within 15 minutes
                </p>
              </div>
            </div>
          </motion.div>

          {/* Achievement Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 bg-[#E8F5E9] rounded-2xl p-4 w-full text-center"
          >
            <div className="text-4xl mb-2">🏆</div>
            <p className="font-semibold text-[#1B5E20]">Achievement Unlocked!</p>
            <p className="text-sm text-[#2E7D32]">+10 Eco Points</p>
          </motion.div>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
        >
          <Button
            className="w-full h-14 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-full text-base font-semibold flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Share Your Impact
          </Button>
          <Button
            onClick={() => navigate("/consumer/home")}
            variant="outline"
            className="w-full h-14 border-2 border-[#2E7D32] text-[#2E7D32] hover:bg-[#E8F5E9] rounded-full text-base font-semibold flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Button>
        </motion.div>
      </div>
    </MobileLayout>
  );
}

function ImpactCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof DollarSign;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
      <div
        className="p-3 rounded-lg"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div className="flex-1">
        <div className="text-sm text-[#9CA3AF]">{label}</div>
        <div className="text-2xl font-bold text-[#111827]">{value}</div>
      </div>
    </div>
  );
}
