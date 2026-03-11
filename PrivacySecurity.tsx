import { useState } from "react";
import { ArrowLeft, Shield, Lock, Eye, MapPin, Download, Trash2, Fingerprint, Smartphone } from "lucide-react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { MobileLayout } from "../../components/MobileLayout";
import { Button } from "../../components/ui/button";

export function PrivacySecurity() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    twoFactor: false,
    biometric: true,
    locationTracking: true,
    dataSharing: false,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

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
          <h1 className="text-2xl font-bold text-[#111827]">Privacy & Security</h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Security */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] mb-6">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">Security</h3>
            
            <SecurityToggle
              icon={Lock}
              title="Two-Factor Authentication"
              description="Add an extra layer of security"
              enabled={settings.twoFactor}
              onToggle={() => toggleSetting("twoFactor")}
            />
            
            <SecurityToggle
              icon={Fingerprint}
              title="Face ID / Biometric Login"
              description="Use biometrics to sign in"
              enabled={settings.biometric}
              onToggle={() => toggleSetting("biometric")}
            />
            
            <div className="pt-3 mt-3 border-t border-gray-100">
              <button
                onClick={() => navigate("/settings/change-password")}
                className="w-full flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Smartphone className="w-5 h-5 text-[#374151]" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-[#111827]">Manage Devices</p>
                  <p className="text-xs text-[#9CA3AF]">View and remove trusted devices</p>
                </div>
              </button>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] mb-6">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">Privacy</h3>
            
            <SecurityToggle
              icon={MapPin}
              title="Location Tracking"
              description="Allow app to access your location"
              enabled={settings.locationTracking}
              onToggle={() => toggleSetting("locationTracking")}
            />
            
            <SecurityToggle
              icon={Eye}
              title="Data Sharing"
              description="Share anonymized data for improvements"
              enabled={settings.dataSharing}
              onToggle={() => toggleSetting("dataSharing")}
            />
          </div>

          {/* Data Management */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] mb-6">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">Data Management</h3>
            
            <button className="w-full flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-xl hover:bg-gray-100 transition-colors mb-3">
              <Download className="w-5 h-5 text-[#2E7D32]" />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-[#111827]">Download My Data</p>
                <p className="text-xs text-[#9CA3AF]">Get a copy of your data</p>
              </div>
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full flex items-center gap-3 p-3 bg-[#D32F2F]/5 rounded-xl hover:bg-[#D32F2F]/10 transition-colors"
            >
              <Trash2 className="w-5 h-5 text-[#D32F2F]" />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-[#D32F2F]">Delete My Account</p>
                <p className="text-xs text-[#D32F2F]/70">Permanently remove your data</p>
              </div>
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-[#E8F5E9] rounded-2xl p-4">
            <div className="flex gap-3">
              <Shield className="w-5 h-5 text-[#2E7D32] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-[#1B5E20] mb-1">
                  Your Privacy Matters
                </h4>
                <p className="text-xs text-[#2E7D32]">
                  We use industry-standard encryption to protect your data. We never sell your personal information to third parties.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Account Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowDeleteModal(false)}
                className="fixed inset-0 bg-black/50 z-40"
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-6 z-50 w-[340px] max-w-[90vw]"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-[#D32F2F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-8 h-8 text-[#D32F2F]" />
                  </div>
                  <h2 className="text-xl font-bold text-[#111827] mb-2">Delete Account?</h2>
                  <p className="text-sm text-[#9CA3AF]">
                    This action cannot be undone. All your data, including saved items and transaction history, will be permanently deleted.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      // Handle account deletion
                      setShowDeleteModal(false);
                    }}
                    className="w-full h-12 bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-full font-semibold"
                  >
                    Yes, Delete My Account
                  </Button>
                  <Button
                    onClick={() => setShowDeleteModal(false)}
                    variant="outline"
                    className="w-full h-12 border-2 border-gray-200 text-[#374151] hover:bg-gray-50 rounded-full font-semibold"
                  >
                    Cancel
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </MobileLayout>
  );
}

function SecurityToggle({
  icon: Icon,
  title,
  description,
  enabled,
  onToggle,
}: {
  icon: typeof Lock;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-b-0">
      <div className="p-2 bg-[#F9FAFB] rounded-lg mt-1">
        <Icon className="w-5 h-5 text-[#374151]" />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-[#111827] mb-1">{title}</h4>
        <p className="text-xs text-[#9CA3AF]">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={`relative w-12 h-7 rounded-full transition-colors ${
          enabled ? "bg-[#2E7D32]" : "bg-gray-300"
        }`}
      >
        <motion.div
          animate={{ x: enabled ? 20 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
        />
      </button>
    </div>
  );
}
