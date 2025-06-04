import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../constants.js';
import type { AuthContextType, User } from '../types.js';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated.toString());
    if (isAuthenticated && user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [isAuthenticated, user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          const loggedInUser: User = { id: 'admin1', email: ADMIN_EMAIL };
          setUser(loggedInUser);
          setIsAuthenticated(true);
          resolve(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
          resolve(false);
        }
      }, 500);
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};