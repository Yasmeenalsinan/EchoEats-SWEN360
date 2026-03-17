import { motion } from "motion/react";
import { User, Store, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { MobileLayout } from "../components/MobileLayout";

export function RoleSelection() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="flex flex-col h-full px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-[#374151] mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-2xl font-bold text-[#111827] mb-2">Continue as</h1>
          <p className="text-[#374151]">Choose how you'd like to use EchoEats</p>
        </motion.div>

        {/* Role Cards */}
        <div className="space-y-4 flex-1">
          <RoleCard
            icon={User}
            title="Consumer"
            description="Find and purchase discounted food near you"
            color="#2E7D32"
            onClick={() => navigate("/signup?role=consumer")}
            delay={0.1}
          />
          <RoleCard
            icon={Store}
            title="Vendor"
            description="List surplus food and reduce waste"
            color="#FF6B35"
            onClick={() => navigate("/signup?role=vendor")}
            delay={0.2}
          />
        </div>
      </div>
    </MobileLayout>
  );
}

function RoleCard({
  icon: Icon,
  title,
  description,
  color,
  onClick,
  delay,
}: {
  icon: typeof User;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
  delay: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] text-left"
    >
      <div className="flex items-start gap-4">
        <div
          className="p-4 rounded-xl"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-8 h-8" style={{ color }} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-[#111827] mb-1">{title}</h3>
          <p className="text-[#374151] text-sm">{description}</p>
        </div>
      </div>
    </motion.button>
  );
}