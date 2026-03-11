import { useState, useEffect } from "react";
import { ArrowLeft, Clock, CreditCard, MapPin, Check, Wallet, Apple } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { MobileLayout } from "../../components/MobileLayout";
import { Button } from "../../components/ui/button";
import { mockListings } from "../../../utils/mockData";
import { transformListingForCard } from "../../../utils/listingTransform";

const PAYMENT_METHODS = [
  { id: "visa", name: "Visa", icon: CreditCard, last4: "4242", type: "Credit Card" },
  { id: "mastercard", name: "Mastercard", icon: CreditCard, last4: "8888", type: "Debit Card" },
  { id: "paypal", name: "PayPal", icon: Wallet, last4: "", type: "user@email.com" },
  { id: "applepay", name: "Apple Pay", icon: Apple, last4: "", type: "Default Card" },
];

export function Reservation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get("itemId");
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentSelector, setShowPaymentSelector] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[0]);

  useEffect(() => {
    loadItem();
  }, [itemId]);

  async function loadItem() {
    try {
      setLoading(true);
      // Find the listing from the same data source as Home page
      const listing = mockListings.find((l) => l.id === itemId);
      if (listing) {
        const transformedItem = {
          ...transformListingForCard(listing),
          // Add additional fields needed for reservation page
          description: listing.description,
          pickupTimes: listing.pickup_times || [],
          vendorAddress: listing.vendor?.location?.address || "",
        };
        setItem(transformedItem);
      }
    } catch (error) {
      console.error("Error loading item:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-100">
          <button
            onClick={() => navigate("/consumer/home")}
            className="flex items-center gap-2 text-[#374151] mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-[#111827]">Reservation</h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Countdown Timer */}
          <motion.div
            animate={timeLeft < 300 ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 1, repeat: timeLeft < 300 ? Infinity : 0 }}
            className={`mb-6 rounded-2xl p-6 text-center ${
              timeLeft < 300 ? "bg-[#D32F2F]/10 border-2 border-[#D32F2F]" : "bg-[#E8F5E9]"
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock
                className={`w-6 h-6 ${
                  timeLeft < 300 ? "text-[#D32F2F]" : "text-[#2E7D32]"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  timeLeft < 300 ? "text-[#D32F2F]" : "text-[#2E7D32]"
                }`}
              >
                Reservation expires in
              </span>
            </div>
            <div
              className={`text-5xl font-bold ${
                timeLeft < 300 ? "text-[#D32F2F]" : "text-[#2E7D32]"
              }`}
            >
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </div>
          </motion.div>

          {/* Item Details */}
          <div className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.06)] mb-6">
            <div className="flex gap-4">
              <img
                src={item.image}
                alt={item.title}
                className="w-24 h-24 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-[#111827] mb-1">
                  {item.title}
                </h3>
                <div className="flex items-center gap-1 text-sm text-[#374151] mb-2">
                  <MapPin className="w-3 h-3" />
                  <span>{item.vendor}</span>
                </div>
                <div className="text-2xl font-bold text-[#2E7D32]">
                  ${item.currentPrice.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] mb-6">
            <h3 className="font-semibold text-[#111827] mb-4">
              Payment Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[#374151]">Subtotal</span>
                <span className="font-semibold text-[#111827]">
                  ${item.currentPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#374151]">Tax</span>
                <span className="font-semibold text-[#111827]">
                  ${(item.currentPrice * 0.0875).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#2E7D32]">You save</span>
                <span className="font-semibold text-[#2E7D32]">
                  -${(item.originalPrice - item.currentPrice).toFixed(2)}
                </span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="font-semibold text-[#111827]">Total</span>
                <span className="text-2xl font-bold text-[#111827]">
                  ${(item.currentPrice * 1.0875).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] mb-6">
            <h3 className="font-semibold text-[#111827] mb-4">
              Payment Method
            </h3>
            <button
              onClick={() => setShowPaymentSelector(true)}
              className="w-full flex items-center gap-3 p-4 bg-[#F9FAFB] hover:bg-gray-100 transition-colors rounded-xl"
            >
              <div className="p-2 bg-white rounded-lg">
                <selectedPayment.icon className="w-5 h-5 text-[#374151]" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-[#111827]">
                  {selectedPayment.last4 ? `•••• ${selectedPayment.last4}` : selectedPayment.type}
                </div>
                <div className="text-sm text-[#9CA3AF]">{selectedPayment.name}</div>
              </div>
              <span className="text-sm text-[#2E7D32] font-semibold">
                Change
              </span>
            </button>
          </div>

          {/* Pickup Instructions */}
          <div className="bg-[#E8F5E9] rounded-2xl p-4 mb-6">
            <h3 className="font-semibold text-[#1B5E20] mb-2">
              Pickup Instructions
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-[#2E7D32]">
                📍 <strong>Location:</strong> {item.vendorAddress}
              </p>
              <p className="text-sm text-[#2E7D32]">
                ⏰ <strong>Available Times:</strong> {item.pickupTimes.join(", ") || "Contact vendor"}
              </p>
              <p className="text-sm text-[#2E7D32] mt-3">
                💡 Show this confirmation to the staff at {item.vendor} to collect your order. Please arrive during the pickup window listed above.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Method Selector Modal */}
        <AnimatePresence>
          {showPaymentSelector && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowPaymentSelector(false)}
                className="fixed inset-0 bg-black/50 z-40"
              />
              
              {/* Modal */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-w-md mx-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[#111827]">Select Payment Method</h2>
                    <button
                      onClick={() => setShowPaymentSelector(false)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3 mb-6">
                    {PAYMENT_METHODS.map((method) => {
                      const Icon = method.icon;
                      const isSelected = selectedPayment.id === method.id;
                      return (
                        <motion.button
                          key={method.id}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setSelectedPayment(method);
                            setShowPaymentSelector(false);
                          }}
                          className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                            isSelected
                              ? "border-[#2E7D32] bg-[#E8F5E9]"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div className={`p-3 rounded-lg ${
                            isSelected ? "bg-[#2E7D32]" : "bg-[#F9FAFB]"
                          }`}>
                            <Icon className={`w-6 h-6 ${
                              isSelected ? "text-white" : "text-[#374151]"
                            }`} />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-[#111827]">
                              {method.name}
                            </div>
                            <div className="text-sm text-[#9CA3AF]">
                              {method.last4 ? `•••• ${method.last4}` : method.type}
                            </div>
                          </div>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-6 h-6 bg-[#2E7D32] rounded-full flex items-center justify-center"
                            >
                              <Check className="w-4 h-4 text-white" />
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setShowPaymentSelector(false)}
                    className="w-full py-3 text-[#2E7D32] font-semibold hover:bg-[#E8F5E9] rounded-xl transition-colors"
                  >
                    + Add New Payment Method
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Bottom Actions */}
        <div className="bg-white border-t border-gray-100 px-6 py-4 space-y-3">
          <Button
            onClick={() => navigate("/consumer/payment-success")}
            className="w-full h-14 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-full text-base font-semibold"
          >
            Confirm Payment
          </Button>
          <Button
            onClick={() => navigate("/consumer/home")}
            variant="outline"
            className="w-full h-14 border-2 border-gray-200 text-[#374151] hover:bg-gray-50 rounded-full text-base font-semibold"
          >
            Cancel Reservation
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}