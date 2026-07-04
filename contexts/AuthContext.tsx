
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { CURRENT_USER_TREASURER, CURRENT_USER_SUPERVISOR, CURRENT_USER_MEMBER, CURRENT_USER_THIERRY } from '../constants';

interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
  verifyUser: () => Promise<void>; // Simuler la validation KYC
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// On ajoute isVerified aux mocks de base (Thierry et Member commencent non-vérifiés)
const MOCK_USERS_AUGMENTED = [
    { ...CURRENT_USER_TREASURER, isVerified: true },
    { ...CURRENT_USER_SUPERVISOR, isVerified: true },
    { ...CURRENT_USER_MEMBER, isVerified: false },
    { ...CURRENT_USER_THIERRY, isVerified: false },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('parelem_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    let foundUser: User | null = null;
    const normalizedEmail = email.toLowerCase().trim();

    const mockMatch = MOCK_USERS_AUGMENTED.find(u => u.email.toLowerCase() === normalizedEmail);

    if (mockMatch) {
      foundUser = mockMatch;
      setUser(foundUser);
      localStorage.setItem('parelem_user', JSON.stringify(foundUser));
    } else {
      setIsLoading(false);
      throw new Error(`Email inconnu.`);
    }
    
    setIsLoading(false);
  };

  const verifyUser = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simule scan d'identité
    if (user) {
      const updatedUser = { ...user, isVerified: true };
      setUser(updatedUser);
      localStorage.setItem('parelem_user', JSON.stringify(updatedUser));
    }
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('parelem_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, verifyUser, isLoading }}>
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
