import { useState, useEffect } from "react";
import { ArrowLeft, Heart, MapPin, Star, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { MobileLayout } from "../../components/MobileLayout";
import { CountdownTimer } from "../../components/CountdownTimer";
import { PriceBadge } from "../../components/PriceBadge";
import { SustainabilityBadge } from "../../components/SustainabilityBadge";
import { DietaryTag } from "../../components/DietaryTag";
import { Button } from "../../components/ui/button";
import { apiCall } from "../../../utils/supabase/client";
import { mockListings } from "../../../utils/mockData";
import { transformListingForCard } from "../../../utils/listingTransform";
import { useLikes } from "../../contexts/LikesContext";

export function ItemDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isLiked, toggleLike } = useLikes();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadItem();
  }, [id]);

  async function loadItem() {
    try {
      setLoading(true);
      // Find the listing from the same data source as Home page
      const listing = mockListings.find((l) => l.id === id);
      if (listing) {
        const transformedItem = {
          ...transformListingForCard(listing),
          // Add additional fields needed for detail page
          rating: listing.vendor?.rating || 4.5,
          description: listing.description,
          dietaryTags: listing.dietary_tags || [],
          co2Saved: 1.2, // Mock value
          expiresAt: new Date(listing.expiry),
          pricingCurve: "exponential" as const,
        };
        setItem(transformedItem);
      }
    } catch (error) {
      console.error("Error loading item:", error);
    } finally {
      setLoading(false);
    }
  }
  
  if (loading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-[#9CA3AF]">Loading...</p>
        </div>
      </MobileLayout>
    );
  }
  
  if (!item) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-[#9CA3AF]">Item not found</p>
        </div>
      </MobileLayout>
    );
  }

  const isFavorite = id ? isLiked(id) : false;

  const handleToggleFavorite = () => {
    if (id) {
      toggleLike(id);
    }
  };

  // Mock price history data
  const priceHistory = [
    { time: "4h", price: item.originalPrice },
    { time: "3h", price: item.originalPrice * 0.85 },
    { time: "2h", price: item.originalPrice * 0.7 },
    { time: "1h", price: item.currentPrice },
    { time: "Now", price: item.currentPrice },
  ];

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="absolute top-11 left-0 right-0 z-10 flex items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate("/consumer/home")}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md"
          >
            <ArrowLeft className="w-5 h-5 text-[#111827]" />
          </button>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleToggleFavorite}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md"
          >
            <motion.div
              animate={isFavorite ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isFavorite ? "fill-[#D32F2F] text-[#D32F2F]" : "text-[#111827]"
                }`}
              />
            </motion.div>
          </motion.button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Image Carousel */}
          <div className="relative h-80">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="bg-white rounded-t-3xl -mt-6 relative px-6 py-6">
            {/* Title & Rating */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-[#111827] mb-2">
                {item.title}
              </h1>
              <div className="flex items-center gap-4 text-[#374151]">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.vendor}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-[#FFA000] text-[#FFA000]" />
                  <span className="text-sm font-medium">{item.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{item.distance}</span>
                </div>
              </div>
            </div>

            {/* Expiration Timer */}
            <div className="mb-4">
              <CountdownTimer expiresAt={item.expiresAt} size="lg" />
            </div>

            {/* Price */}
            <div className="mb-6">
              <PriceBadge
                originalPrice={item.originalPrice}
                currentPrice={item.currentPrice}
                size="lg"
              />
            </div>

            {/* Price Graph */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#111827] mb-3">
                Price History ({item.pricingCurve})
              </h3>
              <div className="bg-[#F9FAFB] rounded-xl p-4">
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={priceHistory}>
                    <XAxis
                      dataKey="time"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#9CA3AF", fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111827",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                      formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#2E7D32"
                      strokeWidth={3}
                      dot={{ fill: "#2E7D32", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Stock & Demand */}
            {item.stockLeft && (
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                className="mb-4 bg-[#FFA000]/10 border border-[#FFA000] rounded-xl p-3"
              >
                <p className="text-[#FFA000] font-semibold text-sm text-center">
                  ⚡ Only {item.stockLeft} left in stock!
                </p>
              </motion.div>
            )}

            {/* Description */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-[#111827] mb-2">
                Description
              </h3>
              <p className="text-[#374151]">{item.description}</p>
            </div>

            {/* Dietary Tags */}
            {item.dietaryTags && item.dietaryTags.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-[#111827] mb-2">
                  Dietary Info
                </h3>
                <div className="flex flex-wrap gap-2">
                  {item.dietaryTags.map((tag) => (
                    <DietaryTag key={tag} type={tag} />
                  ))}
                </div>
              </div>
            )}

            {/* Sustainability */}
            <div className="mb-6">
              <SustainabilityBadge co2Saved={item.co2Saved} size="lg" />
            </div>

            {/* Reserve Button */}
            <div className="pb-8">
              <Button
                onClick={() => navigate(`/consumer/reservation?itemId=${id}`)}
                className="w-full h-14 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-full text-base font-semibold"
              >
                Reserve Now - ${item.currentPrice.toFixed(2)}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}