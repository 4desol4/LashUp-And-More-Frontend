import { useState } from "react";
import { motion } from "framer-motion";
import {
  HiShoppingBag,
  HiUser,
  HiCog,
  HiLogout,
  HiTrash,
} from "react-icons/hi";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/hooks/useOrders";
import OrderList from "@/components/orders/OrderList";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { cn } from "@/utils/helpers";
import {
  EditProfileModal,
  ChangePasswordModal,
  DeleteAccountModal,
} from "@/components/auth/ProfileModals";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [modals, setModals] = useState({
    editProfile: false,
    changePassword: false,
    deleteAccount: false,
  });

  const { user, logout } = useAuth();
  const { orders } = useOrders();

  const tabs = [
    {
      id: "orders",
      name: "My Orders",
      icon: HiShoppingBag,
      count: orders.length,
    },
    {
      id: "profile",
      name: "Profile",
      icon: HiUser,
    },
  ];

  // 📊 Orders stats
  const stats = [
    {
      name: "Total Orders",
      value: orders.length,
      icon: HiShoppingBag,
      color: "text-green-600 bg-green-100 dark:bg-green-900",
    },
    {
      name: "Delivered",
      value: orders.filter((o) => o.status === "DELIVERED").length,
      icon: HiShoppingBag,
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900",
    },
    {
      name: "Pending",
      value: orders.filter((o) => o.status === "PENDING").length,
      icon: HiShoppingBag,
      color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900",
    },
  ];

  const openModal = (modalName) => {
    setModals((prev) => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName) => {
    setModals((prev) => ({ ...prev, [modalName]: false }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "orders":
        return <OrderList />;
      case "profile":
        return (
          <ProfileSection
            user={user}
            onEditProfile={() => openModal("editProfile")}
            onChangePassword={() => openModal("changePassword")}
            onDeleteAccount={() => openModal("deleteAccount")}
          />
        );
      default:
        return <OrderList />;
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-charcoal-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-one text-gray-900 dark:text-white">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600 font-three dark:text-gray-400">
                Manage your orders and profile
              </p>
            </div>
            <Button
              variant="outline"
              onClick={logout}
              className="flex items-center space-x-2 font-three"
            >
              <HiLogout className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-center">
                    <div className={cn("p-3 rounded-lg", stat.color)}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-three font-medium text-gray-600 dark:text-gray-400">
                        {stat.name}
                      </p>
                      <p className="text-2xl font-three font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-charcoal-700">
            <nav className="-mb-px flex space-x-8 font-three overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap",
                      isActive
                        ? "border-primary-500 text-primary-600 dark:text-primary-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-charcoal-600"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                    {tab.count !== undefined && (
                      <span
                        className={cn(
                          "ml-2 py-0.5 px-2 rounded-full text-xs font-medium",
                          isActive
                            ? "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                            : "bg-gray-100 text-gray-800 dark:bg-charcoal-700 dark:text-gray-300"
                        )}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>

      {/* Modals */}
      <EditProfileModal
        isOpen={modals.editProfile}
        onClose={() => closeModal("editProfile")}
        user={user}
      />
      <ChangePasswordModal
        isOpen={modals.changePassword}
        onClose={() => closeModal("changePassword")}
      />
      <DeleteAccountModal
        isOpen={modals.deleteAccount}
        onClose={() => closeModal("deleteAccount")}
      />
    </div>
  );
};

const ProfileSection = ({
  user,
  onEditProfile,
  onChangePassword,
  onDeleteAccount,
}) => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <HiUser className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-one text-gray-900 dark:text-white">
            Profile Information
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileField label="Full Name" value={user?.name} />
          <ProfileField label="Email Address" value={user?.email} />
          <ProfileField label="Account Type" value={user?.role} />
          <ProfileField
            label="Member Since"
            value={new Date(user?.createdAt).toLocaleDateString()}
          />
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button onClick={onEditProfile} className="font-three">
            <HiCog className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          <Button
            variant="outline"
            onClick={onChangePassword}
            className="font-three"
          >
            Change Password
          </Button>
          <Button
            variant="outline"
            onClick={onDeleteAccount}
            className="font-three text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <HiTrash className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
};

const ProfileField = ({ label, value }) => (
  <div>
    <label className="block text-base font-three font-medium text-gray-700 dark:text-gray-300 mb-2">
      {label}
    </label>
    <div className="p-3 bg-gray-50 dark:bg-charcoal-700 rounded-lg">
      <p className="text-gray-900 dark:text-white font-three">{value}</p>
    </div>
  </div>
);

export default Dashboard;
