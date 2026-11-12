import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  admin: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<User | null>(() => {
    const saved = localStorage.getItem('lms_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('lms_admin_token');
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('lms_admin_token');
      if (storedToken) {
        try {
          const res = await authApi.getMe();
          setAdmin(res.user);
          localStorage.setItem('lms_admin_user', JSON.stringify(res.user));
        } catch {
          // If token is invalid or expired, clear storage
          localStorage.removeItem('lms_admin_token');
          localStorage.removeItem('lms_admin_user');
          setToken(null);
          setAdmin(null);
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    localStorage.setItem('lms_admin_token', res.token);
    localStorage.setItem('lms_admin_user', JSON.stringify(res.user));
    setToken(res.token);
    setAdmin(res.user);
  };

  const logout = () => {
    localStorage.removeItem('lms_admin_token');
    localStorage.removeItem('lms_admin_user');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!token && !!admin,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
