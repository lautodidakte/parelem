import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { CURRENT_USER_TREASURER, CURRENT_USER_SUPERVISOR, CURRENT_USER_MEMBER } from '../constants';

interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('mon_pare_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay

    let foundUser: User | null = null;
    const normalizedEmail = email.toLowerCase().trim();

    if (normalizedEmail === CURRENT_USER_TREASURER.email.toLowerCase()) {
      foundUser = CURRENT_USER_TREASURER;
    } else if (normalizedEmail === CURRENT_USER_SUPERVISOR.email.toLowerCase()) {
      foundUser = CURRENT_USER_SUPERVISOR;
    } else if (normalizedEmail === CURRENT_USER_MEMBER.email.toLowerCase()) {
      foundUser = CURRENT_USER_MEMBER;
    }

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('mon_pare_user', JSON.stringify(foundUser));
    } else {
      setIsLoading(false);
      throw new Error("Email inconnu. Essayez 'mahamat@monpare.td' (Trésorier), 'fatime@ngo-chad.org' (Superviseur) ou 'zara@monpare.td' (Membre).");
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mon_pare_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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