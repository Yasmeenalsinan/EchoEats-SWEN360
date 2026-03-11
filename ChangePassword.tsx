import { useState } from "react";
import { ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { MobileLayout } from "../../components/MobileLayout";
import { Button } from "../../components/ui/button";

export function ChangePassword() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    // Validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (formData.newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    // In production, this would call an API
    setError("");
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate(-1);
    }, 2000);
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
          <h1 className="text-2xl font-bold text-[#111827]">Change Password</h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
            <div className="flex gap-3">
              <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-blue-900 mb-1">
                  Password Requirements
                </h3>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• Mix of letters and numbers recommended</li>
                  <li>• Avoid common passwords</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Password Form */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] mb-6">
            <PasswordField
              label="Current Password"
              value={formData.currentPassword}
              onChange={(value) => setFormData({ ...formData, currentPassword: value })}
              show={showPasswords.current}
              onToggleShow={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
              placeholder="Enter current password"
            />
            
            <div className="my-6 border-t border-gray-200" />
            
            <PasswordField
              label="New Password"
              value={formData.newPassword}
              onChange={(value) => setFormData({ ...formData, newPassword: value })}
              show={showPasswords.new}
              onToggleShow={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
              placeholder="Enter new password"
            />
            
            <PasswordField
              label="Confirm New Password"
              value={formData.confirmPassword}
              onChange={(value) => setFormData({ ...formData, confirmPassword: value })}
              show={showPasswords.confirm}
              onToggleShow={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
              placeholder="Re-enter new password"
            />
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6"
            >
              <p className="text-sm font-medium text-red-800">{error}</p>
            </motion.div>
          )}

          {/* Save Button */}
          <Button
            onClick={handleSave}
            className="w-full h-14 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-full text-base font-semibold mb-4"
          >
            Update Password
          </Button>

          {/* Help Text */}
          <div className="text-center">
            <button
              onClick={() => navigate("/settings/help")}
              className="text-sm text-[#2E7D32] font-semibold"
            >
              Forgot your current password?
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {showSuccess && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-6 right-6 bg-[#2E7D32] text-white px-6 py-4 rounded-2xl shadow-lg flex items-center gap-3 z-50 max-w-md mx-auto"
          >
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              ✓
            </div>
            <span className="font-semibold">Password updated successfully!</span>
          </motion.div>
        )}
      </div>
    </MobileLayout>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggleShow,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggleShow: () => void;
  placeholder: string;
}) {
  return (
    <div className="mb-4 last:mb-0">
      <label className="flex items-center gap-2 text-sm font-medium text-[#374151] mb-2">
        <Lock className="w-4 h-4" />
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-12 bg-[#F9FAFB] rounded-xl border border-gray-200 focus:outline-none focus:border-[#2E7D32] transition-colors"
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#374151] transition-colors"
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
