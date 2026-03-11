import { ArrowLeft, Globe, DollarSign, Check } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { MobileLayout } from "../../components/MobileLayout";

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
];

const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
];

export function LanguageRegion() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("USD");

  return (
    <MobileLayout>
      <div className="flex flex-col h-full bg-[#F9FAFB]">
        <div className="bg-white px-6 py-4 border-b border-gray-100">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#374151] mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-[#111827]">Language & Region</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] mb-6">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">Language</h3>
            <div className="space-y-2">
              {LANGUAGES.map((lang) => (
                <motion.button
                  key={lang.code}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setLanguage(lang.code)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl ${
                    language === lang.code ? "bg-[#E8F5E9]" : "bg-[#F9FAFB]"
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="flex-1 text-left font-medium text-[#111827]">{lang.name}</span>
                  {language === lang.code && <Check className="w-5 h-5 text-[#2E7D32]" />}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">Currency</h3>
            <div className="space-y-2">
              {CURRENCIES.map((curr) => (
                <motion.button
                  key={curr.code}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrency(curr.code)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl ${
                    currency === curr.code ? "bg-[#E8F5E9]" : "bg-[#F9FAFB]"
                  }`}
                >
                  <div className="w-10 h-10 bg-[#2E7D32]/10 rounded-lg flex items-center justify-center">
                    <span className="font-bold text-[#2E7D32]">{curr.symbol}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-[#111827]">{curr.code}</p>
                    <p className="text-xs text-[#9CA3AF]">{curr.name}</p>
                  </div>
                  {currency === curr.code && <Check className="w-5 h-5 text-[#2E7D32]" />}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
