import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/index.ts';
import { api } from '../services/api.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  signup: (data: { name: string; email: string; password: string; phone: string; role?: UserRole }) => Promise<void>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('bitedash_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res: any = await api.get('/auth/me');
        if (res.data?.user) {
          setUser(res.data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Failed to verify existing session:', err);
        logout();
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = async (email: string, password = 'password123') => {
    setIsLoading(true);
    try {
      const res: any = await api.post('/auth/login', { email, password });
      const { user, token: newToken } = res.data;
      localStorage.setItem('bitedash_token', newToken);
      setToken(newToken);
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: { name: string; email: string; password: string; phone: string; role?: UserRole }) => {
    setIsLoading(true);
    try {
      const res: any = await api.post('/auth/signup', data);
      const { user, token: newToken } = res.data;
      localStorage.setItem('bitedash_token', newToken);
      setToken(newToken);
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('bitedash_token');
    setToken(null);
    setUser(null);
  };

  const switchDemoRole = async (role: UserRole) => {
    const roleEmailMap: Record<UserRole, string> = {
      CUSTOMER: 'customer@bitedash.com',
      RESTAURANT: 'partner@pizzaslice.com',
      DELIVERY: 'delivery@bitedash.com',
      ADMIN: 'admin@bitedash.com',
    };
    await login(roleEmailMap[role], 'password123');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
