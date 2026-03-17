import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, FlaskConical, TrendingUp, BarChart3, Lightbulb } from "lucide-react";
import { MobileLayout } from "../../components/MobileLayout";

const strategies = [
  {
    id: "A",
    title: "Strategy A",
    curve: "Linear",
    avgPrice: "$7.20",
    sold: "34",
    revenue: "$244",
    sellRate: "76%",
  },
  {
    id: "B",
    title: "Strategy B",
    curve: "Exponential",
    avgPrice: "$6.90",
    sold: "41",
    revenue: "$283",
    sellRate: "84%",
  },
];

const pastTests = [
  { id: 1, title: "Past Test A", description: "Price-based strategy comparison" },
  { id: 2, title: "Past Test B", description: "Demand-based strategy review" },
];

export function ABTesting() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("B");

  const bestStrategy = strategies.find((strategy) => strategy.id === selected);

  return (
    <MobileLayout>
      <div className="flex flex-col h-full bg-[#F9FAFB]">
        <div className="bg-white px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/vendor/dashboard")}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5 text-[#374151]" />
            </button>
            <div>
              <p className="text-sm text-[#9CA3AF]">Vendor</p>
              <h1 className="text-2xl font-bold text-[#111827]">A/B Testing</h1>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <section className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-2 mb-3">
              <FlaskConical className="w-5 h-5 text-[#2E7D32]" />
              <h2 className="text-lg font-semibold text-[#111827]">Current Test</h2>
            </div>

            <div className="space-y-3">
              {strategies.map((strategy) => (
                <button
                  key={strategy.id}
                  onClick={() => setSelected(strategy.id)}
                  className={`w-full text-left rounded-2xl p-4 border ${
                    selected === strategy.id
                      ? "border-[#2E7D32] bg-[#E8F5E9]"
                      : "border-[#E5E7EB] bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-[#111827]">
                        {strategy.title} ({strategy.curve})
                      </p>
                      <p className="text-sm text-[#6B7280] mt-1">
                        Compare performance across listing strategies
                      </p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        selected === strategy.id
                          ? "border-[#2E7D32] bg-[#2E7D32]"
                          : "border-[#D1D5DB]"
                      }`}
                    />
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-2 gap-3">
            {strategies.map((strategy, index) => (
              <motion.div
                key={strategy.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
              >
                <h3 className="font-semibold text-[#111827] mb-3">{strategy.title}</h3>
                <div className="space-y-2 text-sm">
                  <MetricRow label="Avg. Price" value={strategy.avgPrice} />
                  <MetricRow label="Items Sold" value={strategy.sold} />
                  <MetricRow label="Revenue" value={strategy.revenue} />
                  <MetricRow label="Sell Rate" value={strategy.sellRate} />
                </div>
              </motion.div>
            ))}
          </section>

          <section className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-[#FF8F00]" />
              <h2 className="text-lg font-semibold text-[#111827]">Recommendation</h2>
            </div>

            <div className="rounded-2xl bg-[#F9FAFB] p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center shrink-0">
                  <Lightbulb className="w-5 h-5 text-[#2E7D32]" />
                </div>
                <div>
                  <p className="font-semibold text-[#111827]">
                    Best Performing Strategy: {bestStrategy?.title}
                  </p>
                  <p className="text-sm text-[#6B7280] mt-1">
                    {bestStrategy?.title} is currently performing better based on revenue
                    and sell-through rate.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-5 h-5 text-[#1976D2]" />
              <h2 className="text-lg font-semibold text-[#111827]">Past Tests</h2>
            </div>

            <div className="space-y-3">
              {pastTests.map((test) => (
                <div key={test.id} className="rounded-xl bg-[#F9FAFB] p-3">
                  <p className="font-medium text-[#111827]">{test.title}</p>
                  <p className="text-sm text-[#6B7280] mt-1">{test.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </MobileLayout>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[#6B7280]">{label}</span>
      <span className="font-semibold text-[#111827]">{value}</span>
    </div>
  );
}
