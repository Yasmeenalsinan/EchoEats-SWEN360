import { ArrowLeft, FileText, Shield, Eye, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { MobileLayout } from "../../components/MobileLayout";

export function Legal() {
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
          <h1 className="text-2xl font-bold text-[#111827]">Terms & Privacy</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <LegalItem
              icon={FileText}
              title="Terms of Service"
              description="Last updated: Feb 25, 2026"
              onClick={() => {}}
            />
            <LegalItem
              icon={Shield}
              title="Privacy Policy"
              description="How we protect your data"
              onClick={() => {}}
            />
            <LegalItem
              icon={Eye}
              title="Cookie Policy"
              description="How we use cookies"
              onClick={() => {}}
            />
            <LegalItem
              icon={FileText}
              title="Community Guidelines"
              description="Rules for vendors and consumers"
              onClick={() => {}}
              noBorder
            />
          </div>

          <div className="mt-6 bg-[#E8F5E9] rounded-2xl p-4">
            <p className="text-sm text-[#2E7D32] text-center">
              By using EchoEats, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

function LegalItem({
  icon: Icon,
  title,
  description,
  onClick,
  noBorder = false,
}: {
  icon: any;
  title: string;
  description: string;
  onClick: () => void;
  noBorder?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-4 hover:bg-[#F9FAFB] transition-colors ${
        !noBorder ? "border-b border-gray-100" : ""
      }`}
    >
      <div className="p-2 bg-[#2E7D32]/10 rounded-lg">
        <Icon className="w-5 h-5 text-[#2E7D32]" />
      </div>
      <div className="flex-1 text-left">
        <h4 className="text-sm font-semibold text-[#111827]">{title}</h4>
        <p className="text-xs text-[#9CA3AF]">{description}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-[#9CA3AF]" />
    </button>
  );
}
