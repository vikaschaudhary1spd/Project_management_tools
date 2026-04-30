import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginPayload, RegisterPayload } from '../types';
import { authAPI } from '../api/auth';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access');
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          if (decoded.exp * 1000 > Date.now()) {
            const userData = await authAPI.getProfile();
            setUser(userData);
          } else {
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
          }
        } catch (error) {
          console.error('Auth init error:', error);
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: LoginPayload) => {
    const response = await authAPI.login(data);
    localStorage.setItem('access', response.access);
    localStorage.setItem('refresh', response.refresh);
    setUser(response.user);
  };

  const register = async (data: RegisterPayload) => {
    const response = await authAPI.register(data);
    localStorage.setItem('access', response.access);
    localStorage.setItem('refresh', response.refresh);
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
