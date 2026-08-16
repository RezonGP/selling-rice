import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { IUser } from '../types';
import { apiClient } from '../api/client';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string, otpToken?: string) => Promise<{ requires2FA?: boolean }>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => localStorage.getItem(ACCESS_TOKEN_KEY));

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);

    if (token) localStorage.setItem(ACCESS_TOKEN_KEY, token);
    else localStorage.removeItem(ACCESS_TOKEN_KEY);
  }, [user, token]);

  // Intercept 401 responses globally and auto-logout
  useEffect(() => {
    const interceptor = apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          setUser(null);
          setToken(null);
          localStorage.removeItem(ACCESS_TOKEN_KEY);
          localStorage.removeItem(REFRESH_TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        }
        return Promise.reject(error);
      }
    );
    return () => apiClient.interceptors.response.eject(interceptor);
  }, []);

  const login = useCallback(async (email: string, password: string, otpToken?: string) => {
    const res = await apiClient.post('/auth/login', { email, password, otpToken });

    if (res.data.requires2FA) {
      return { requires2FA: true };
    }

    // ✅ Fixed: handle both response shapes: data.data.tokens and data.data.accessToken
    const responseData = res.data.data;
    const userData: IUser = responseData.user;
    const accessToken: string = responseData.tokens?.accessToken ?? responseData.accessToken;
    const refreshToken: string = responseData.tokens?.refreshToken ?? responseData.refreshToken;

    setUser(userData);
    setToken(accessToken);

    // ✅ Fixed: save refreshToken for later use
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }

    return {};
  }, []);

  const register = useCallback(async (data: any) => {
    const res = await apiClient.post('/auth/register', data);
    const responseData = res.data.data;
    const userData: IUser = responseData.user;
    const accessToken: string = responseData.tokens?.accessToken ?? responseData.accessToken;
    const refreshToken: string = responseData.tokens?.refreshToken ?? responseData.refreshToken;

    setUser(userData);
    setToken(accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  }, []);

  const logout = useCallback(() => {
    apiClient.post('/auth/logout').catch(() => {});
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }, []);

  const isAuthenticated = Boolean(token && user);
  const isAdmin = Boolean(user && (user.role === 'ADMIN' || user.role === 'STAFF'));

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
