import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { authAPI } from "@/services/auth";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/ui/Spinner";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import {
  HiTrash,
  HiUser,
  HiCog,
  HiSearch,
  HiUserGroup,
  HiMail,
  HiCalendar,
  HiShoppingBag,
  HiBadgeCheck,
  HiFilter,
  HiEye,
  HiX,
} from "react-icons/hi";
import { formatCurrency, dateFormatters } from "@/utils/formatters";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await authAPI.getAllUsers();
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter]);

  const filterUsers = () => {
    let filtered = [...users];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleRoleChange = (userId, newRole) => {
    toast(
      (t) => (
        <div className="space-y-3">
          <p className="text-gray-900 dark:text-white">
            Are you sure you want to change this user's role to{" "}
            <span className="font-semibold text-blue-600">{newRole}</span>?
          </p>
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={async () => {
                try {
                  await authAPI.updateUserRole(userId, newRole);
                  toast.dismiss(t.id);
                  toast.success("Role updated successfully");
                  fetchUsers();
                } catch (err) {
                  toast.error(
                    err.response?.data?.message || "Failed to update role"
                  );
                }
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Yes, Change
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ),
      { duration: 8000 }
    );
  };

  const handleDeleteUser = (userId, userName) => {
    toast(
      (t) => (
        <div className="space-y-3">
          <p className="text-gray-900 dark:text-white">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-red-600">{userName}</span>?
            <br />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              This action cannot be undone.
            </span>
          </p>
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={async () => {
                try {
                  await authAPI.deleteUser(userId);
                  toast.dismiss(t.id);
                  toast.success("User deleted successfully");
                  fetchUsers();
                } catch (err) {
                  toast.error(
                    err.response?.data?.message || "Failed to delete user"
                  );
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, Delete
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ),
      { duration: 8000 }
    );
  };

  const handleViewDetails = async (userId) => {
    try {
      const res = await authAPI.getUserDetails(userId);
      setSelectedUser(res.data);
    } catch (err) {
      toast.error("Failed to load user details");
    }
  };

  const getRoleColor = (role) => {
    return role === "admin"
      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .substring(0, 2);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-primary-900 rounded-lg flex items-center justify-center">
            <HiUserGroup className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-one text-gray-900 dark:text-white">
              User Management
            </h2>
            <p className="text-gray-600 dark:text-gray-400 font-three">
              Manage system users and permissions
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-blue-800 dark:text-blue-400">
              {filteredUsers.length} users
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-charcoal-700 text-gray-900 dark:text-white font-three focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <HiFilter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Users Grid */}
      {filteredUsers.length === 0 ? (
        <Card className="p-12 text-center">
          <HiUserGroup className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-one text-gray-900 dark:text-white mb-2">
            No users found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 font-three">
            {searchTerm || roleFilter !== "all"
              ? "Try adjusting your search or filters."
              : "No users have been registered yet."}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-primary-900 rounded-full flex items-center justify-center text-white font-semibold">
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <h3 className="font-one text-gray-900 dark:text-white text-lg">
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-three">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-three font-medium ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {user.role === "admin" ? (
                      <span className="flex items-center  space-x-1">
                        <HiBadgeCheck className="w-3 h-3" />
                        <span>Admin</span>
                      </span>
                    ) : (
                      "User"
                    )}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <HiCalendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400 font-three">
                      Joined {dateFormatters.toReadable(user.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewDetails(user.id)}
                    className="flex items-center space-x-1 font-three font-medium text-base"
                  >
                    <HiEye className="w-4 h-4" />
                    <span>View Details</span>
                  </Button>

                  {user.id !== currentUser?.id && (
                    <div className="flex items-center space-x-2">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="text-base font-three font-bold border border-gray-300 dark:border-gray-600 rounded px-5 py-2 bg-white dark:bg-charcoal-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUser(user.id, user.name);
                        }}
                        className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-2"
                      >
                        <HiTrash className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* User Details Modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="User Details"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* User Header */}
            <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-charcoal-900 dark:to-charcoal-800 rounded-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {getInitials(selectedUser.name)}
              </div>
              <div>
                <h3 className="text-2xl font-one text-gray-900 dark:text-white">
                  {selectedUser.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 font-three">
                  {selectedUser.email}
                </p>
                <span
                  className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium mt-2 ${getRoleColor(
                    selectedUser.role
                  )}`}
                >
                  {selectedUser.role === "admin" && (
                    <HiBadgeCheck className="w-4 h-4" />
                  )}
                  <span className="capitalize">{selectedUser.role}</span>
                </span>
              </div>
            </div>

            {/* User Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-one text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                  <HiUser className="w-5 h-5 text-blue-600" />
                  <span>Account Information</span>
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400 font-three">
                      User ID:
                    </span>
                    <span className="text-gray-900 dark:text-white font-mono text-sm">
                      {selectedUser.id.slice(-8)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400 font-three">
                      Joined:
                    </span>
                    <span className="text-gray-900 dark:text-white font-three">
                      {dateFormatters.toReadable(selectedUser.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-one text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                  <HiShoppingBag className="w-5 h-5 text-green-600" />
                  <span>Activity Summary</span>
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400 font-three">
                      Total Orders:
                    </span>
                    <span className="text-gray-900 dark:text-white font-semibold">
                      {selectedUser.orders?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Section */}
            {selectedUser.orders && selectedUser.orders.length > 0 && (
              <div>
                <h4 className="font-one text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <HiShoppingBag className="w-5 h-5 text-purple-600" />
                  <span>Recent Orders</span>
                </h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {selectedUser.orders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="p-4 border border-gray-200 dark:border-charcoal-700 rounded-lg bg-gray-50 dark:bg-charcoal-900"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium font-three text-gray-900 dark:text-white">
                            {order.product?.name || "Product"}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-three">
                            Ref: {order.paymentReference || "N/A"}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === "DELIVERED"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : order.status === "SHIPPED"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400 font-three">
                          {formatCurrency(order.totalAmount)}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400 font-three">
                          {dateFormatters.toReadable(order.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;
