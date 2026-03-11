import { useState } from "react";
import { ArrowLeft, Camera, User, Mail, Phone, MapPin, Lock, Building, Store } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { MobileLayout } from "../../components/MobileLayout";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../context/AuthContext";

export function EditProfile() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  // Prioritize profile data from database
  const accountType = profile?.role || user?.role || "consumer";

  const [formData, setFormData] = useState({
    name: profile?.name || user?.name || "",
    email: profile?.email || user?.email || "",
    phone: profile?.phone || user?.phone || "",
    location: profile?.location || user?.location || "",
    businessName: profile?.businessName || user?.businessName || "",
    businessType: profile?.businessType || user?.businessType || "restaurant",
    businessAddress: profile?.businessAddress || user?.businessAddress || "",
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    // In production, this would call an API
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate(-1);
    }, 2000);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
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
          <h1 className="text-2xl font-bold text-[#111827]">Edit Profile</h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Profile Photo */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] mb-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {formData.name ? getInitials(formData.name) : "U"}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-[#2E7D32] rounded-full text-white shadow-lg">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-sm font-semibold text-[#111827] mb-1">Profile Photo</h3>
              <p className="text-xs text-[#9CA3AF]">Click camera to change</p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] mb-6">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">Basic Information</h3>
            
            <FormField
              icon={User}
              label="Full Name"
              value={formData.name}
              onChange={(value) => setFormData({ ...formData, name: value })}
              placeholder="Enter your name"
            />
            
            <FormField
              icon={Mail}
              label="Email Address"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: value })}
              placeholder="your@email.com"
              type="email"
            />
            
            <FormField
              icon={Phone}
              label="Phone Number"
              value={formData.phone}
              onChange={(value) => setFormData({ ...formData, phone: value })}
              placeholder="+1 (555) 123-4567"
            />
            
            <FormField
              icon={MapPin}
              label="Location"
              value={formData.location}
              onChange={(value) => setFormData({ ...formData, location: value })}
              placeholder="City, State"
            />
          </div>

          {/* Vendor-specific fields */}
          {accountType === "vendor" && (
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] mb-6">
              <h3 className="text-sm font-semibold text-[#111827] mb-4">Business Information</h3>
              
              <FormField
                icon={Building}
                label="Business Name"
                value={formData.businessName}
                onChange={(value) => setFormData({ ...formData, businessName: value })}
                placeholder="Your Business Name"
              />
              
              <div className="mb-4">
                <label className="flex items-center gap-2 text-sm font-medium text-[#374151] mb-2">
                  <Store className="w-4 h-4" />
                  Business Type
                </label>
                <select
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F9FAFB] rounded-xl border border-gray-200 focus:outline-none focus:border-[#2E7D32] transition-colors"
                >
                  <option value="restaurant">Restaurant</option>
                  <option value="bakery">Bakery</option>
                  <option value="cafe">Cafe</option>
                  <option value="grocery">Grocery Store</option>
                  <option value="home_cook">Home Cook</option>
                </select>
              </div>
              
              <FormField
                icon={MapPin}
                label="Business Address"
                value={formData.businessAddress}
                onChange={(value) => setFormData({ ...formData, businessAddress: value })}
                placeholder="123 Main St, City, State"
              />
            </div>
          )}

          {/* Security */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] mb-6">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">Security</h3>
            <button
              onClick={() => navigate("/settings/change-password")}
              className="w-full flex items-center gap-3 px-4 py-3 bg-[#F9FAFB] rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Lock className="w-5 h-5 text-[#374151]" />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-[#111827]">Change Password</p>
                <p className="text-xs text-[#9CA3AF]">Update your password</p>
              </div>
            </button>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            className="w-full h-14 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-full text-base font-semibold mb-4"
          >
            Save Changes
          </Button>
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
            <span className="font-semibold">Profile updated successfully!</span>
          </motion.div>
        )}
      </div>
    </MobileLayout>
  );
}

function FormField({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  icon: typeof User;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div className="mb-4 last:mb-0">
      <label className="flex items-center gap-2 text-sm font-medium text-[#374151] mb-2">
        <Icon className="w-4 h-4" />
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-[#F9FAFB] rounded-xl border border-gray-200 focus:outline-none focus:border-[#2E7D32] transition-colors"
      />
    </div>
  );
}