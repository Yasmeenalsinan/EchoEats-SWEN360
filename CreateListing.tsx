import { useState } from "react";
import { ArrowLeft, ImagePlus, Clock3, DollarSign, Tag, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { MobileLayout } from "../../components/MobileLayout";

const dietaryOptions = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Halal",
  "Kosher",
  "Keto",
  "Dairy-Free",
  "Nut-Free",
];

const pricingCurves = [
  {
    id: "linear",
    title: "Linear",
    description: "Price decreases evenly over time",
  },
  {
    id: "exponential",
    title: "Exponential",
    description: "Price drops faster closer to expiry",
  },
  {
    id: "stepped",
    title: "Stepped",
    description: "Price changes at fixed intervals",
  },
];

export function CreateListing() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [minimumPrice, setMinimumPrice] = useState("");
  const [expiresIn, setExpiresIn] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [pricingCurve, setPricingCurve] = useState("linear");
  const [demandExpectation, setDemandExpectation] = useState("medium");

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const handlePublish = () => {
    console.log({
      title,
      description,
      basePrice,
      minimumPrice,
      expiresIn,
      selectedTags,
      pricingCurve,
      demandExpectation,
    });

    navigate("/vendor/active-listings");
  };

  return (
    <MobileLayout>
      <div className="flex flex-col h-full bg-[#F9FAFB]">
        {/* Header */}
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
              <h1 className="text-2xl font-bold text-[#111827]">New Listing</h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Image */}
          <section className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <h2 className="text-lg font-semibold text-[#111827] mb-3">Item Photo</h2>
            <button className="w-full h-40 rounded-2xl border-2 border-dashed border-[#D1D5DB] flex flex-col items-center justify-center bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors">
              <ImagePlus className="w-8 h-8 text-[#2E7D32] mb-2" />
              <span className="text-sm font-medium text-[#111827]">Tap to upload image</span>
              <span className="text-xs text-[#9CA3AF] mt-1">JPG or PNG</span>
            </button>
          </section>

          {/* Basic Information */}
          <section className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.06)] space-y-4">
            <h2 className="text-lg font-semibold text-[#111827]">Basic Information</h2>

            <Field label="Product Name">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter product name"
                className="w-full bg-[#F9FAFB] rounded-xl px-4 py-3 outline-none border border-transparent focus:border-[#2E7D32]"
              />
            </Field>

            <Field label="Description">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a short description"
                rows={4}
                className="w-full bg-[#F9FAFB] rounded-xl px-4 py-3 outline-none border border-transparent focus:border-[#2E7D32] resize-none"
              />
            </Field>
          </section>

          {/* Timing & Pricing */}
          <section className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.06)] space-y-4">
            <h2 className="text-lg font-semibold text-[#111827]">Timing & Pricing</h2>

            <Field label="Base Price">
              <div className="flex items-center gap-3 bg-[#F9FAFB] rounded-xl px-4 py-3">
                <DollarSign className="w-5 h-5 text-[#2E7D32]" />
                <input
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </Field>

            <Field label="Minimum Price">
              <div className="flex items-center gap-3 bg-[#F9FAFB] rounded-xl px-4 py-3">
                <TrendingUp className="w-5 h-5 text-[#FF8F00]" />
                <input
                  value={minimumPrice}
                  onChange={(e) => setMinimumPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </Field>

            <Field label="Expires In">
              <div className="flex items-center gap-3 bg-[#F9FAFB] rounded-xl px-4 py-3">
                <Clock3 className="w-5 h-5 text-[#1976D2]" />
                <input
                  value={expiresIn}
                  onChange={(e) => setExpiresIn(e.target.value)}
                  placeholder="e.g. 3 hours"
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </Field>
          </section>

          {/* Dietary Tags */}
          <section className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-5 h-5 text-[#2E7D32]" />
              <h2 className="text-lg font-semibold text-[#111827]">Dietary Tags</h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-[#2E7D32] text-white"
                      : "bg-[#F3F4F6] text-[#374151]"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>

          {/* Pricing Strategy */}
          <section className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <h2 className="text-lg font-semibold text-[#111827] mb-3">Pricing Strategy</h2>

            <div className="space-y-3">
              {pricingCurves.map((curve) => (
                <button
                  key={curve.id}
                  onClick={() => setPricingCurve(curve.id)}
                  className={`w-full text-left rounded-2xl p-4 border transition-all ${
                    pricingCurve === curve.id
                      ? "border-[#2E7D32] bg-[#E8F5E9]"
                      : "border-[#E5E7EB] bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-[#111827]">{curve.title}</p>
                      <p className="text-sm text-[#6B7280] mt-1">{curve.description}</p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        pricingCurve === curve.id
                          ? "border-[#2E7D32] bg-[#2E7D32]"
                          : "border-[#D1D5DB]"
                      }`}
                    />
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Demand Expectation */}
          <section className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <h2 className="text-lg font-semibold text-[#111827] mb-3">Demand Expectation</h2>
            <div className="grid grid-cols-3 gap-3">
              {["low", "medium", "high"].map((level) => (
                <button
                  key={level}
                  onClick={() => setDemandExpectation(level)}
                  className={`py-3 rounded-xl font-medium capitalize ${
                    demandExpectation === level
                      ? "bg-[#2E7D32] text-white"
                      : "bg-[#F3F4F6] text-[#374151]"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </section>

          {/* Price Projection */}
          <section className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <h2 className="text-lg font-semibold text-[#111827] mb-3">Price Projection</h2>
            <div className="h-32 rounded-2xl bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-[#6B7280]">Projected decay preview</p>
                <p className="text-lg font-semibold text-[#111827] mt-1 capitalize">
                  {pricingCurve} pricing selected
                </p>
              </div>
            </div>
          </section>

          {/* Publish */}
          <div className="pb-8">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handlePublish}
              className="w-full h-14 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-full text-base font-semibold"
            >
              Publish Listing
            </motion.button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#111827] mb-2">{label}</label>
      {children}
    </div>
  );
}
