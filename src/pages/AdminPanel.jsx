import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  HiViewGrid,
  HiShoppingBag,
  HiPhotograph,
  HiUsers,
  HiSupport,
} from "react-icons/hi";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/hooks/useOrders";
import { useProducts } from "@/hooks/useProducts";
import { useGallery } from "@/hooks/useGallery";
import { useServices } from "@/hooks/useServices";
import OrderList from "@/components/orders/OrderList";
import ProductManagement from "@/components/admin/ProductManagement";
import GalleryManagement from "@/components/admin/GalleryManagement";
import ServiceManagement from "@/components/admin/ServiceManagement";
import Card from "@/components/ui/Card";
import { cn } from "@/utils/helpers";
import { authAPI } from "@/services/auth";
import toast from "react-hot-toast";
import UserManagement from "../components/admin/UserManagement";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();
  const { orders } = useOrders(true);
  const { products } = useProducts();
  const { items: galleryItems } = useGallery();
  const { services } = useServices();
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await authAPI.getAllUsers();
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  const tabs = [
    { id: "overview", name: "Overview", icon: HiViewGrid },
    { id: "orders", name: "Orders", icon: HiShoppingBag, count: orders.length },
    {
      id: "products",
      name: "Products",
      icon: HiShoppingBag,
      count: products.length,
    },
    {
      id: "gallery",
      name: "Gallery",
      icon: HiPhotograph,
      count: galleryItems.length,
    },
    {
      id: "services",
      name: "Services",
      icon: HiSupport,
      count: services.length,
    },
    { id: "users", name: "Users", icon: HiUsers, count: users.length },
  ];

  const stats = [
    {
      name: "Total Orders",
      value: orders.length,
      icon: HiShoppingBag,
      color: "text-green-600 bg-green-100 dark:bg-green-900",
      change: "+8%",
    },
    {
      name: "Active Products",
      value: products.filter((p) => p.isActive).length,
      icon: HiShoppingBag,
      color: "text-purple-600 bg-purple-100 dark:bg-purple-900",
      change: "+3%",
    },
    {
      name: "Gallery Items",
      value: galleryItems.length,
      icon: HiPhotograph,
      color: "text-pink-600 bg-pink-100 dark:bg-pink-900",
      change: "+15%",
    },
    {
      name: "Services",
      value: services.length,
      icon: HiSupport,
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900",
      change: "+5%",
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewSection stats={stats} orders={orders} />;
      case "orders":
        return <OrderList isAdmin={true} />;
      case "products":
        return <ProductManagement />;
      case "gallery":
        return <GalleryManagement />;
      case "services":
        return <ServiceManagement />;
      case "users":
        return <UserManagement />;
      default:
        return <OverviewSection stats={stats} orders={orders} />;
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-one text-gray-900 dark:text-white">
                Admin Panel
              </h1>
              <p className="text-gray-600 font-three dark:text-gray-400">
                Manage your business operations
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <HiUsers className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-three text-gray-600 dark:text-gray-400">
                Welcome, {user?.name}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-charcoal-700">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center space-x-2 py-4 px-1 border-b-2 font-medium font-three text-[0.9rem] whitespace-nowrap transition-colors",
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
    </div>
  );
};

const OverviewSection = ({ stats, orders }) => {
  const recentOrders = orders.slice(0, 5);
  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-three text-gray-600 dark:text-gray-400">
                      {stat.name}
                    </p>
                    <p className="text-2xl font-one text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-base font-three text-green-600 font-medium">
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={cn("p-3 rounded-lg", stat.color)}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-one text-gray-900 dark:text-white">
            Recent Orders
          </h3>
          <HiShoppingBag className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-3">
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 font-one dark:text-gray-400 text-sm">
              No recent orders
            </p>
          ) : (
            recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-charcoal-700 rounded-lg"
              >
                <div>
                  <p className="font-medium font-three text-gray-900 dark:text-white">
                    {order.product?.name || "Product"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {order.user?.name || "Customer"} • Qty: {order.quantity}
                  </p>
                </div>
                <span
                  className={cn(
                    "px-2 py-1 rounded-full text-xs font-bold font-three",
                    order.status === "DELIVERED"
                      ? "bg-green-100 text-green-800"
                      : order.status === "SHIPPED"
                      ? "bg-blue-100 text-blue-800"
                      : order.status === "CONFIRMED"
                      ? "bg-purple-100 text-purple-800"
                      : order.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  )}
                >
                  {order.status}
                </span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminPanel;
