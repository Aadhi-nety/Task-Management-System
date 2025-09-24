import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authAPI } from '@/lib/api';

export const useAuth = () => {
  const { user, token, isAuthenticated, login, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        login(JSON.parse(storedUser), storedToken);
      }
      setLoading(false);
    };

    checkAuth();
  }, [login]);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      if (response.data.success) {
        login(response.data.data.user, response.data.data.token);
        return { success: true };
      }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const signUp = async (username: string, email: string, password: string) => {
    try {
      const response = await authAPI.register({ username, email, password });
      if (response.data.success) {
        login(response.data.data.user, response.data.data.token);
        return { success: true };
      }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const signOut = () => {
    logout();
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    signIn,
    signUp,
    signOut,
  };
};