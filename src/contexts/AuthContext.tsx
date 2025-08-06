import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockAPI } from '@/lib/mockAPI';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, role: 'patient' | 'admin') => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = mockAPI.verifyToken(token);
        if (userData) {
          setUser(userData);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await mockAPI.login(email, password);
      if (result.success && result.token && result.user) {
        localStorage.setItem('token', result.token);
        setUser(result.user);
        return { success: true };
      }
      return { success: false, error: result.error || 'Login failed' };
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: 'patient' | 'admin') => {
    setLoading(true);
    try {
      const result = await mockAPI.register(name, email, password, role);
      if (result.success && result.token && result.user) {
        localStorage.setItem('token', result.token);
        setUser(result.user);
        return { success: true };
      }
      return { success: false, error: result.error || 'Registration failed' };
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};