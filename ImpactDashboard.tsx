import { ArrowLeft, Package, DollarSign, Leaf, Award, Share2, TrendingUp, Users } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { MobileLayout } from "../../components/MobileLayout";
import { Button } from "../../components/ui/button";

export function ImpactDashboard() {
  const navigate = useNavigate();

  const stats = {
    mealsRescued: 47,
    co2Saved: 23.5,
    moneySaved: 312,
    communityRank: 127,
    totalUsers: 15420,
  };

  const shareImpact = () => {
    // In production, this would trigger native share
    alert("Share your impact on social media!");
  };

  return (
    <MobileLayout>
      <div className="flex flex-col h-full bg-[#F9FAFB]">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/90 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-white mb-2">Your Impact</h1>
          <p className="text-white/80 text-sm">Making a difference, one meal at a time</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <ImpactCard
              icon={Package}
              label="Meals Rescued"
              value={stats.mealsRescued.toString()}
              color="#2E7D32"
              trend="+12 this month"
            />
            <ImpactCard
              icon={Leaf}
              label="CO₂ Saved"
              value={`${stats.co2Saved}kg`}
              color="#66BB6A"
              trend="+8.3kg this month"
            />
            <ImpactCard
              icon={DollarSign}
              label="Money Saved"
              value={`$${stats.moneySaved}`}
              color="#FF6B35"
              trend="+$87 this month"
              className="col-span-2"
            />
          </div>

          {/* Community Rank */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#FFA000] to-[#FF6B35] rounded-2xl p-6 mb-6 text-white shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Award className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold">Community Hero</h3>
                <p className="text-white/80 text-sm">Top 1% of EcoWarriors</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">#{stats.communityRank}</div>
                <div className="text-xs text-white/80">of {stats.totalUsers.toLocaleString()}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>Up 23 ranks this week!</span>
            </div>
          </motion.div>

          {/* Achievements */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] mb-6">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">Recent Achievements</h3>
            
            <div className="space-y-3">
              <Achievement
                emoji="🌟"
                title="First Rescue"
                description="Rescued your first meal"
                date="Jan 15, 2026"
                unlocked
              />
              <Achievement
                emoji="🔥"
                title="10 Day Streak"
                description="Rescued meals 10 days in a row"
                date="Feb 20, 2026"
                unlocked
              />
              <Achievement
                emoji="🌱"
                title="Eco Warrior"
                description="Saved 20kg of CO₂"
                date="Feb 24, 2026"
                unlocked
              />
              <Achievement
                emoji="💰"
                title="Smart Saver"
                description="Saved $300 on food"
                progress={312}
                goal={300}
                unlocked
              />
              <Achievement
                emoji="🏆"
                title="Century Club"
                description="Rescue 100 meals"
                progress={47}
                goal={100}
              />
            </div>
          </div>

          {/* Monthly Breakdown */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] mb-6">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">This Month</h3>
            
            <div className="space-y-3">
              <MonthlyItem
                label="Meals Rescued"
                value="12"
                change="+3"
                positive
              />
              <MonthlyItem
                label="CO₂ Prevented"
                value="8.3kg"
                change="+2.1kg"
                positive
              />
              <MonthlyItem
                label="Money Saved"
                value="$87"
                change="+$24"
                positive
              />
              <MonthlyItem
                label="Vendors Supported"
                value="7"
                change="+2"
                positive
              />
            </div>
          </div>

          {/* Share Button */}
          <Button
            onClick={shareImpact}
            className="w-full h-14 bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] hover:from-[#1B5E20] hover:to-[#2E7D32] text-white rounded-full text-base font-semibold flex items-center justify-center gap-2 mb-4"
          >
            <Share2 className="w-5 h-5" />
            Share My Impact
          </Button>

          {/* Info */}
          <div className="bg-[#E8F5E9] rounded-2xl p-4 mb-6">
            <div className="flex gap-3">
              <Users className="w-5 h-5 text-[#2E7D32] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-[#1B5E20] mb-1">
                  Join the Movement
                </h4>
                <p className="text-xs text-[#2E7D32]">
                  Together, our community has rescued over 2.3 million meals and prevented 1,150 tons of CO₂ emissions!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

function ImpactCard({
  icon: Icon,
  label,
  value,
  color,
  trend,
  className = "",
}: {
  icon: typeof Package;
  label: string;
  value: string;
  color: string;
  trend?: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.06)] ${className}`}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div className="text-3xl font-bold text-[#111827] mb-1">{value}</div>
      <div className="text-sm text-[#9CA3AF] mb-2">{label}</div>
      {trend && (
        <div className="text-xs text-[#2E7D32] font-semibold flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {trend}
        </div>
      )}
    </motion.div>
  );
}

function Achievement({
  emoji,
  title,
  description,
  date,
  unlocked = false,
  progress,
  goal,
}: {
  emoji: string;
  title: string;
  description: string;
  date?: string;
  unlocked?: boolean;
  progress?: number;
  goal?: number;
}) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl ${unlocked ? "bg-[#E8F5E9]" : "bg-[#F9FAFB]"}`}>
      <div className="text-3xl">{emoji}</div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-[#111827]">{title}</h4>
        <p className="text-xs text-[#9CA3AF]">{description}</p>
        {date && unlocked && (
          <p className="text-xs text-[#2E7D32] font-semibold mt-1">Unlocked {date}</p>
        )}
        {progress !== undefined && goal !== undefined && !unlocked && (
          <div className="mt-2">
            <div className="flex justify-between text-xs text-[#9CA3AF] mb-1">
              <span>{progress} / {goal}</span>
              <span>{Math.round((progress / goal) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2E7D32] rounded-full"
                style={{ width: `${(progress / goal) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
      {unlocked && <Award className="w-5 h-5 text-[#2E7D32]" />}
    </div>
  );
}

function MonthlyItem({
  label,
  value,
  change,
  positive,
}: {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-[#374151]">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-[#111827]">{value}</span>
        <span className={`text-xs font-semibold ${positive ? "text-[#2E7D32]" : "text-[#D32F2F]"}`}>
          {change}
        </span>
      </div>
    </div>
  );
}
