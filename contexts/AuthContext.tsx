import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { User, Order } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (name: string, email: string) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void;
  addOrder: (order: Order) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = sessionStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from sessionStorage", error);
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');
    }
  }, [user]);


  const login = (name: string, email: string) => {
    const newUser: User = { 
        name, 
        email, 
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=222831&color=FFFFFF`,
        currency: 'UYU',
        orders: [],
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updatedData: Partial<User>) => {
    setUser(prevUser => prevUser ? { ...prevUser, ...updatedData } : null);
  };

  const addOrder = (order: Order) => {
    setUser(prevUser => {
        if (!prevUser) return null;
        const updatedOrders = [...(prevUser.orders || []), order];
        return { ...prevUser, orders: updatedOrders };
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout, updateUser, addOrder }}>
      {children}
    </AuthContext.Provider>
  );
};