import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Heart, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { MobileLayout } from "../../components/MobileLayout";
import { FoodCard } from "../../components/FoodCard";
import { useLikes } from "../../contexts/LikesContext";
import { apiCall } from "../../../utils/supabase/client";
import { transformListingForCard } from "../../../utils/listingTransform";

export function Likes() {
  const navigate = useNavigate();
  const { likedItems } = useLikes();
  const [likedListings, setLikedListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLikedListings();
  }, [likedItems]);

  async function loadLikedListings() {
    try {
      setLoading(true);
      
      // Fetch all listings
      const listingsData = await apiCall("/listings");
      const allListings = listingsData.listings || [];
      
      // Filter to only liked items
      const liked = allListings.filter((listing: any) => 
        likedItems.has(listing.id)
      );
      
      setLikedListings(liked);
    } catch (error) {
      console.error("Error loading liked listings:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#2E7D32] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-[#6B7280]">Loading your favorites...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="flex flex-col h-full bg-[#F9FAFB]">
        {/* Header */}
        <div className="bg-white px-4 py-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate("/consumer/home")}
              className="p-2 hover:bg-[#F3F4F6] rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#111827]" />
            </button>
            <h1 className="text-xl font-bold text-[#111827]">Saved Items</h1>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-2 bg-[#E8F5E9] px-4 py-3 rounded-xl">
            <Heart className="w-5 h-5 text-[#2E7D32] fill-[#2E7D32]" />
            <div>
              <p className="text-sm font-semibold text-[#2E7D32]">
                {likedListings.length} {likedListings.length === 1 ? "Item" : "Items"} Saved
              </p>
              <p className="text-xs text-[#1B5E20]">
                Book before they're gone!
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {likedListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <div className="w-20 h-20 bg-[#F3F4F6] rounded-full flex items-center justify-center mb-4">
                <Heart className="w-10 h-10 text-[#9CA3AF]" />
              </div>
              <h2 className="text-lg font-semibold text-[#111827] mb-2">
                No saved items yet
              </h2>
              <p className="text-sm text-[#6B7280] mb-6 max-w-xs">
                Start saving your favorite food deals by tapping the heart icon on any listing
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/consumer/home")}
                className="flex items-center gap-2 bg-[#2E7D32] text-white px-6 py-3 rounded-full font-semibold"
              >
                <ShoppingBag className="w-5 h-5" />
                Explore Deals
              </motion.button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {likedListings.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FoodCard
                    {...item}
                    onClick={() => navigate(`/consumer/item/${item.id}`)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
