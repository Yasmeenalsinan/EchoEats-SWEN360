import { motion } from "motion/react";
import { Leaf, TrendingDown, Heart } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { MobileLayout } from "../components/MobileLayout";

export function Welcome() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        {/* Hero Section */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="relative mb-8"
          >
            <div className="w-24 h-24 bg-[#2E7D32] rounded-3xl flex items-center justify-center shadow-lg">
              <Leaf className="w-12 h-12 text-white" />
            </div>
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -right-2 -top-2 bg-[#FF6B35] rounded-full p-2"
            >
              <TrendingDown className="w-5 h-5 text-white" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-[#111827] mb-3 text-center"
          >
            EchoEats
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-base text-[#374151] text-center max-w-xs mb-8"
          >
            Eat Smart. Save Money. Reduce Waste.
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 mb-12 w-full max-w-sm"
          >
            <FeatureItem
              icon={TrendingDown}
              text="Dynamic prices that decrease as expiration approaches"
              color="#FF6B35"
            />
            <FeatureItem
              icon={Heart}
              text="Save money while fighting food waste"
              color="#2E7D32"
            />
            <FeatureItem
              icon={Leaf}
              text="Reduce your environmental impact with every meal"
              color="#66BB6A"
            />
          </motion.div>
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 space-y-3"
        >
          <Button
            onClick={() => navigate("/role-selection")}
            className="w-full h-14 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-full text-base font-semibold"
          >
            Sign Up
          </Button>
          <Button
            onClick={() => navigate("/login")}
            variant="outline"
            className="w-full h-14 border-2 border-[#2E7D32] text-[#2E7D32] hover:bg-[#E8F5E9] rounded-full text-base font-semibold"
          >
            Log In
          </Button>
        </motion.div>
      </div>
    </MobileLayout>
  );
}

function FeatureItem({ icon: Icon, text, color }: { icon: typeof Leaf; text: string; color: string }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="p-2 rounded-lg shrink-0"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <p className="text-sm text-[#374151] leading-relaxed">{text}</p>
    </div>
  );
}