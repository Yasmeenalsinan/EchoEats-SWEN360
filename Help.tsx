import { ArrowLeft, HelpCircle, MessageCircle, Mail, Phone, FileText } from "lucide-react";
import { useNavigate } from "react-router";
import { MobileLayout } from "../../components/MobileLayout";

const FAQ_ITEMS = [
  { q: "How does dynamic pricing work?", a: "Prices automatically decrease as expiration approaches to reduce food waste." },
  { q: "Can I cancel a reservation?", a: "Yes, you can cancel up to 30 minutes before pickup time." },
  { q: "How do I become a vendor?", a: "Sign up with a vendor account and complete verification." },
  { q: "What happens if I miss pickup?", a: "You'll be charged a 50% fee to support the vendor." },
];

export function Help() {
  const navigate = useNavigate();

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
          <h1 className="text-2xl font-bold text-[#111827]">Help Center</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Contact Support */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] mb-6">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">Contact Us</h3>
            <div className="space-y-3">
              <ContactOption icon={MessageCircle} label="Live Chat" sublabel="Available 24/7" />
              <ContactOption icon={Mail} label="Email Support" sublabel="support@echoeats.com" />
              <ContactOption icon={Phone} label="Phone" sublabel="+1 (555) 123-4567" />
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                  <h4 className="text-sm font-semibold text-[#111827] mb-2">{item.q}</h4>
                  <p className="text-sm text-[#9CA3AF]">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

function ContactOption({ icon: Icon, label, sublabel }: { icon: any; label: string; sublabel: string }) {
  return (
    <button className="w-full flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-xl hover:bg-gray-100 transition-colors">
      <div className="p-2 bg-[#2E7D32]/10 rounded-lg">
        <Icon className="w-5 h-5 text-[#2E7D32]" />
      </div>
      <div className="flex-1 text-left">
        <p className="text-sm font-medium text-[#111827]">{label}</p>
        <p className="text-xs text-[#9CA3AF]">{sublabel}</p>
      </div>
    </button>
  );
}
