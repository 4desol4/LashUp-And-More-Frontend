import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "@/services/auth";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);

      const response = await authAPI.login(credentials);
      const { token, user: userData } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);

      toast.success("Welcome back!");
      return { success: true };
    } catch (error) {
      console.error("Login error in context:", error);
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);

      await authAPI.register(userData);
      toast.success("Registration successful! Please log in.");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);

      const safeProfileData = {
        name: profileData.name,
        email: profileData.email,
      };

      await authAPI.updateProfile(safeProfileData);

      const refreshResult = await refreshUser();
      if (!refreshResult.success) {
        throw new Error("Failed to refresh user data");
      }

      toast.success("Profile updated successfully");
      return { success: true };
    } catch (error) {
      console.error("Profile update error:", error);
      const message = error.response?.data?.message || "Profile update failed";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // SECURE: Password change
  const changePassword = async (passwordData) => {
    try {
      setLoading(true);

      await authAPI.changePassword(passwordData);
      toast.success("Password changed successfully");
      return { success: true };
    } catch (error) {
      console.error("Password change error:", error);
      const message = error.response?.data?.message || "Password change failed";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, role) => {
    try {
      setLoading(true);
      if (!isAdmin()) {
        throw new Error("Access denied. Admin required.");
      }
      await authAPI.updateUserRole(userId, role);
      toast.success("User role updated successfully");
      return { success: true };
    } catch (error) {
      console.error("Role update error:", error);
      const message = error.response?.data?.message || "Role update failed";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };


  const isAdmin = () => {
    if (!user) return false;
    const role = user.role?.toLowerCase();
    return role === "admin";
  };

  
  const hasRole = (targetRole) => {
    if (!user) return false;
    const userRole = user.role?.toLowerCase();
    return userRole === targetRole.toLowerCase();
  };

  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData };
    setUser(newUserData);
    localStorage.setItem("user", JSON.stringify(newUserData));
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.getProfile();
      const userData = response.data.user;
      updateUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      console.error("Error refreshing user data:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to refresh user data",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
    updateProfile,
    changePassword,
    updateUserRole,
    isAdmin,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
