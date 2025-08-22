import React, { useState } from "react";
import { HiUser, HiLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import { useAuth } from "@/context/AuthContext";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { AlertTriangle } from "lucide-react";

export const EditProfileModal = ({ isOpen, onClose, user }) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const { updateProfile, loading } = useAuth(); // Use AuthContext instead of direct API

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name?.trim() || !formData.email?.trim()) {
      toast.error("Name and email are required");
      return;
    }

    if (formData.name.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }

    if (!formData.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const result = await updateProfile({
        name: formData.name.trim(),
        email: formData.email.trim(),
       
      });

      if (result.success) {
        onClose();
        
      }
    } catch (error) {
      console.error("Profile update error:", error);
      
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-6">
        <div className="flex items-center space-x-3 mb-6">
          <HiUser className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-one text-gray-900 dark:text-white">
            Edit Profile
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-three font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-charcoal-600 rounded-lg bg-white dark:bg-charcoal-800 text-gray-900 dark:text-white font-three focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
              minLength={2}
              maxLength={50}
            />
          </div>

          <div>
            <label className="block text-sm font-three font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-charcoal-600 rounded-lg bg-white dark:bg-charcoal-800 text-gray-900 dark:text-white font-three focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mt-4">
            <p className="text-sm text-blue-800 dark:text-blue-200 font-three">
              <strong>Note:</strong> Your account role and other security
              settings cannot be changed here.
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 font-three"
            >
              {loading ? "Updating..." : "Update Profile"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 font-three"
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};


export const ChangePasswordModal = ({ isOpen, onClose }) => {
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

  const { changePassword, loading } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      toast.error("All password fields are required");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    try {
      const result = await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (result.success) {
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        onClose();
      }
    } catch (error) {
      console.error("Password change error:", error);
     
    }
  };

  const toggleShowPassword = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-6">
        <div className="flex items-center space-x-3 mb-6">
          <HiLockClosed className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-one text-gray-900 dark:text-white">
            Change Password
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-three font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData({ ...formData, currentPassword: e.target.value })
                }
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-charcoal-600 rounded-lg bg-white dark:bg-charcoal-800 text-gray-900 dark:text-white font-three focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
              <button
                type="button"
                onClick={() => toggleShowPassword("current")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPasswords.current ? (
                  <HiEyeOff className="w-5 h-5" />
                ) : (
                  <HiEye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-three font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-charcoal-600 rounded-lg bg-white dark:bg-charcoal-800 text-gray-900 dark:text-white font-three focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => toggleShowPassword("new")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPasswords.new ? (
                  <HiEyeOff className="w-5 h-5" />
                ) : (
                  <HiEye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-three font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-charcoal-600 rounded-lg bg-white dark:bg-charcoal-800 text-gray-900 dark:text-white font-three focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => toggleShowPassword("confirm")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPasswords.confirm ? (
                  <HiEyeOff className="w-5 h-5" />
                ) : (
                  <HiEye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Password Match Indicator */}
          {formData.newPassword && formData.confirmPassword && (
            <div
              className={`text-sm ${
                formData.newPassword === formData.confirmPassword
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {formData.newPassword === formData.confirmPassword
                ? "✓ Passwords match"
                : "✗ Passwords do not match"}
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              disabled={
                loading || formData.newPassword !== formData.confirmPassword
              }
              className="flex-1 font-three"
            >
              {loading ? "Changing..." : "Change Password"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 font-three"
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};


export const DeleteAccountModal = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      toast.error("Password is required");
      return;
    }

    setLoading(true);

    try {
     
      const { authAPI } = await import("@/services/auth");
      await authAPI.deleteAccount(password);
      toast.success("Account deleted successfully");
      logout();
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete account";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-6">
        <div className="flex items-center space-x-3 mb-6">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <h2 className="text-xl font-one text-gray-900 dark:text-white">
            Delete Account
          </h2>
        </div>

        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200 font-three">
            <strong>Warning:</strong> This action cannot be undone. All your
            data will be permanently deleted.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-three font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter your password to confirm
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-charcoal-600 rounded-lg bg-white dark:bg-charcoal-800 text-gray-900 dark:text-white font-three focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 font-three"
            >
              {loading ? "Deleting..." : "Delete Account"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 font-three"
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
