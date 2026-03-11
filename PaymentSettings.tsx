import { useState } from "react";
import { ArrowLeft, CreditCard, Plus, Check, Apple, Wallet, MapPin, Clock } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { MobileLayout } from "../../components/MobileLayout";

const SAVED_CARDS = [
  { id: "1", type: "visa", last4: "4242", expiry: "12/26", isDefault: true },
  { id: "2", type: "mastercard", last4: "8888", expiry: "09/25", isDefault: false },
];

const TRANSACTIONS = [
  {
    id: "1",
    vendor: "La Boulangerie",
    item: "Fresh Croissants & Pastries",
    date: "Feb 24, 2026",
    amount: 12.49,
    status: "completed",
  },
  {
    id: "2",
    vendor: "Zen Sushi Bar",
    item: "Vegetarian Sushi Platter",
    date: "Feb 23, 2026",
    amount: 19.20,
    status: "completed",
  },
  {
    id: "3",
    vendor: "Bella Pizza",
    item: "Gourmet Pizza Slices",
    date: "Feb 22, 2026",
    amount: 7.20,
    status: "completed",
  },
  {
    id: "4",
    vendor: "Green Leaf Cafe",
    item: "Organic Salad Bowls",
    date: "Feb 20, 2026",
    amount: 10.50,
    status: "refunded",
  },
];

export function PaymentSettings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"cards" | "history">("cards");
  const [applePayEnabled, setApplePayEnabled] = useState(true);

  return (
    <MobileLayout>
      <div className="flex flex-col h-full bg-[#F9FAFB]">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-100">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#374151] mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-[#111827]">Payment Methods</h1>
        </div>

        {/* Tabs */}
        <div className="bg-white px-6 py-3 border-b border-gray-100">
          <div className="flex gap-2">
            <TabButton
              label="Payment Methods"
              active={activeTab === "cards"}
              onClick={() => setActiveTab("cards")}
            />
            <TabButton
              label="Transaction History"
              active={activeTab === "history"}
              onClick={() => setActiveTab("history")}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {activeTab === "cards" ? (
            <>
              {/* Digital Wallets */}
              <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] mb-6">
                <h3 className="text-sm font-semibold text-[#111827] mb-4">
                  Digital Wallets
                </h3>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-black rounded-lg">
                      <Apple className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#111827]">Apple Pay</h4>
                      <p className="text-xs text-[#9CA3AF]">Quick & secure payments</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setApplePayEnabled(!applePayEnabled)}
                    className={`relative w-12 h-7 rounded-full transition-colors ${
                      applePayEnabled ? "bg-[#2E7D32]" : "bg-gray-300"
                    }`}
                  >
                    <motion.div
                      animate={{ x: applePayEnabled ? 20 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#0070BA] rounded-lg">
                      <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#111827]">PayPal</h4>
                      <p className="text-xs text-[#9CA3AF]">user@email.com</p>
                    </div>
                  </div>
                  <button className="text-sm font-semibold text-[#2E7D32]">
                    Connect
                  </button>
                </div>
              </div>

              {/* Saved Cards */}
              <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] mb-6">
                <h3 className="text-sm font-semibold text-[#111827] mb-4">
                  Saved Cards
                </h3>
                
                <div className="space-y-3">
                  {SAVED_CARDS.map((card) => (
                    <CardItem key={card.id} card={card} />
                  ))}
                  
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/settings/add-card")}
                    className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-300 rounded-xl text-[#2E7D32] hover:border-[#2E7D32] hover:bg-[#E8F5E9] transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="font-semibold">Add New Card</span>
                  </motion.button>
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] mb-6">
                <h3 className="text-sm font-semibold text-[#111827] mb-4">
                  Billing Address
                </h3>
                <button
                  onClick={() => navigate("/settings/billing-address")}
                  className="w-full flex items-center gap-3 p-4 bg-[#F9FAFB] rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <MapPin className="w-5 h-5 text-[#374151]" />
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-[#111827]">123 Main St, San Francisco, CA 94102</p>
                  </div>
                </button>
              </div>
            </>
          ) : (
            /* Transaction History */
            <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-[#111827]">Recent Transactions</h3>
              </div>
              
              <div className="divide-y divide-gray-100">
                {TRANSACTIONS.map((transaction) => (
                  <TransactionItem key={transaction.id} transaction={transaction} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
        active
          ? "bg-[#2E7D32] text-white"
          : "text-[#9CA3AF] hover:text-[#374151]"
      }`}
    >
      {label}
    </button>
  );
}

function CardItem({ card }: { card: typeof SAVED_CARDS[0] }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-[#F9FAFB] rounded-xl">
      <div className="p-2 bg-white rounded-lg">
        <CreditCard className="w-5 h-5 text-[#374151]" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#111827]">
            •••• {card.last4}
          </span>
          {card.isDefault && (
            <span className="text-xs px-2 py-0.5 bg-[#2E7D32]/10 text-[#2E7D32] rounded-full font-semibold">
              Default
            </span>
          )}
        </div>
        <p className="text-xs text-[#9CA3AF]">
          {card.type.charAt(0).toUpperCase() + card.type.slice(1)} • Expires {card.expiry}
        </p>
      </div>
      {card.isDefault && <Check className="w-5 h-5 text-[#2E7D32]" />}
    </div>
  );
}

function TransactionItem({ transaction }: { transaction: typeof TRANSACTIONS[0] }) {
  const isRefunded = transaction.status === "refunded";

  return (
    <div className="flex items-center gap-3 p-4 hover:bg-[#F9FAFB] transition-colors">
      <div className={`p-2 rounded-lg ${
        isRefunded ? "bg-[#D32F2F]/10" : "bg-[#2E7D32]/10"
      }`}>
        <Clock className={`w-5 h-5 ${
          isRefunded ? "text-[#D32F2F]" : "text-[#2E7D32]"
        }`} />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-[#111827]">{transaction.vendor}</h4>
        <p className="text-xs text-[#9CA3AF]">{transaction.item}</p>
        <p className="text-xs text-[#9CA3AF] mt-1">{transaction.date}</p>
      </div>
      <div className="text-right">
        <p className={`text-sm font-bold ${
          isRefunded ? "text-[#D32F2F]" : "text-[#111827]"
        }`}>
          {isRefunded ? "-" : ""}${transaction.amount.toFixed(2)}
        </p>
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
          isRefunded
            ? "bg-[#D32F2F]/10 text-[#D32F2F]"
            : "bg-[#2E7D32]/10 text-[#2E7D32]"
        }`}>
          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
        </span>
      </div>
    </div>
  );
}
