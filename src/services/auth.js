import api from './api';

export const authAPI = {
  // Register new user
  register: (userData) => {
    return api.post('/auth/register', userData);
  },

  // Login user
  login: (credentials) => {
    return api.post('/auth/login', credentials);
  },

  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve();
  },

  getProfile: () => {
    return api.get("/auth/profile");
  },

  
  updateProfile: (profileData) => {
    
    const safeData = {
      name: profileData.name,
      email: profileData.email
     
    };
    return api.put("/auth/profile", safeData);
  },

  changePassword: (passwordData) => {
    return api.put("/auth/change-password", passwordData);
  },

  deleteAccount: (password) => {
    return api.delete("/auth/account", { data: { password } });
  },

 
  updateUserRole: (userId, role) => {
    return api.put(`/auth/admin/user/${userId}/role`, { role });
  },

  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },


  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  
  isAdmin: () => {
    const user = localStorage.getItem('user');
    if (!user) return false;
    try {
      const parsedUser = JSON.parse(user);
      const role = parsedUser.role?.toLowerCase();
      return role === 'admin';
    } catch {
      return false;
    }
  },


  hasRole: (targetRole) => {
    const user = localStorage.getItem('user');
    if (!user) return false;
    try {
      const parsedUser = JSON.parse(user);
      const userRole = parsedUser.role?.toLowerCase();
      return userRole === targetRole.toLowerCase();
    } catch {
      return false;
    }
  },

  // Get user role
  getUserRole: () => {
    const user = localStorage.getItem('user');
    if (!user) return null;
    try {
      const parsedUser = JSON.parse(user);
      return parsedUser.role;
    } catch {
      return null;
    }
  },


  refreshUserData: async () => {
    try {
      const response = await api.get("/auth/profile");
      const userData = response.data.user;
      
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Error refreshing user data:', error);
      return { success: false, error: error.response?.data?.message };
    }
  },


  getAuthHeader: () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
};