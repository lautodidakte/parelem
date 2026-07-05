
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { CURRENT_USER_TREASURER, CURRENT_USER_SUPERVISOR, CURRENT_USER_MEMBER, CURRENT_USER_THIERRY, CURRENT_USER_DEMO } from '../constants';

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  verifyUser: () => Promise<void>; // Simuler la validation KYC
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Compte de démonstration : identifiants fixes, mot de passe requis.
const DEMO_EMAIL = 'demo@parelem.com';
const DEMO_PASSWORD = 'Parelem@235';

// On ajoute isVerified aux mocks de base (Thierry et Member commencent non-vérifiés)
const MOCK_USERS_AUGMENTED = [
    { ...CURRENT_USER_TREASURER, isVerified: true },
    { ...CURRENT_USER_SUPERVISOR, isVerified: true },
    { ...CURRENT_USER_MEMBER, isVerified: false },
    { ...CURRENT_USER_THIERRY, isVerified: false },
    { ...CURRENT_USER_DEMO, isVerified: true },
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

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const normalizedEmail = email.toLowerCase().trim();

    // Le compte de démonstration exige son mot de passe.
    if (normalizedEmail === DEMO_EMAIL && password !== undefined && password !== DEMO_PASSWORD) {
      setIsLoading(false);
      throw new Error('Mot de passe incorrect.');
    }

    const mockMatch = MOCK_USERS_AUGMENTED.find(u => u.email.toLowerCase() === normalizedEmail);

    if (mockMatch) {
      setUser(mockMatch);
      localStorage.setItem('parelem_user', JSON.stringify(mockMatch));
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
