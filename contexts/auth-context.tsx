import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextValue {
  isAuthenticated: boolean;
  signInWithGoogle: () => void;
  registerAsProfessional: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signInWithGoogle = () => {
    // TODO: Integrate real Google OAuth using expo-auth-session or Firebase
    // Simulate success for now
    setTimeout(() => setIsAuthenticated(true), 800);
  };

  const registerAsProfessional = () => {
    // TODO: Navigate to professional registration flow
    console.log('Register as Professional tapped');
  };

  const logout = () => setIsAuthenticated(false);

  const value: AuthContextValue = {
    isAuthenticated,
    signInWithGoogle,
    registerAsProfessional,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
