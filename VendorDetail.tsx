import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, MapPin, Star, Clock } from "lucide-react";
import { motion } from "motion/react";
import { MobileLayout } from "../../components/MobileLayout";
import { FoodCard } from "../../components/FoodCard";
import { apiCall } from "../../../utils/supabase/client";

export function VendorDetail() {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVendorData();
  }, [vendorId]);

  async function loadVendorData() {
    try {
      setLoading(true);

      // Fetch vendor info
      const vendorData = await apiCall(`/vendors/${vendorId}`);
      setVendor(vendorData.vendor);

      // Fetch vendor's listings
      const listingsData = await apiCall(`/listings/vendor/${vendorId}`);
      setListings(listingsData.listings);
    } catch (error) {
      console.error("Error loading vendor data:", error);
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
            <p className="text-[#6B7280]">Loading vendor...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  if (!vendor) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center h-full px-6">
          <p className="text-xl text-[#6B7280] mb-4">Vendor not found</p>
          <button
            onClick={() => navigate("/consumer/home")}
            className="text-[#2E7D32] font-semibold hover:underline"
          >
            Back to Home
          </button>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] px-6 py-4">
          <button
            onClick={() => navigate("/consumer/home")}
            className="flex items-center gap-2 text-white/90 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          {/* Vendor Info */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <h1 className="text-2xl font-bold text-white mb-2">{vendor.businessName}</h1>
            <div className="flex items-center gap-4 text-white/90 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-white" />
                <span>{vendor.rating?.toFixed(1) || "4.5"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{vendor.businessType}</span>
              </div>
            </div>
          </motion.div>

          {/* Address */}
          {vendor.address && (
            <div className="flex items-start gap-2 text-white/80 text-sm bg-white/10 rounded-lg p-3">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{vendor.address}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-[#F9FAFB] -mt-4 rounded-t-3xl">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#111827]">
                Available Listings
              </h2>
              <span className="text-sm text-[#9CA3AF]">
                {listings.length} available
              </span>
            </div>

            {listings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#6B7280] mb-2">No active listings</p>
                <p className="text-sm text-[#9CA3AF]">Check back later for new deals</p>
              </div>
            ) : (
              <div className="space-y-4">
                {listings.map((item, index) => (
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
      </div>
    </MobileLayout>
  );
}
