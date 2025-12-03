// AuthContext - Manages user authentication state and actions

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, username: string, role: 'player' | 'organizer') => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database for demo purposes
const mockUsers: Map<string, { user: User; password: string }> = new Map([
  ['player@demo.com', {
    password: 'demo123',
    user: {
      id: 'u1',
      email: 'player@demo.com',
      username: 'DemoPlayer',
      avatar: '/placeholder.svg',
      role: 'player',
      stats: {
        tournamentsPlayed: 25,
        tournamentsWon: 5,
        totalEarnings: 75000,
        rank: 'Ace'
      }
    }
  }],
  ['organizer@demo.com', {
    password: 'demo123',
    user: {
      id: 'u2',
      email: 'organizer@demo.com',
      username: 'DemoOrganizer',
      avatar: '/placeholder.svg',
      role: 'organizer',
      stats: {
        tournamentsPlayed: 0,
        tournamentsWon: 0,
        totalEarnings: 0,
        rank: 'N/A'
      }
    }
  }]
]);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Login function - validates against mock database
  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const userData = mockUsers.get(email.toLowerCase());
    
    if (!userData) {
      setIsLoading(false);
      return { success: false, error: 'User not found. Try player@demo.com or organizer@demo.com' };
    }
    
    if (userData.password !== password) {
      setIsLoading(false);
      return { success: false, error: 'Incorrect password. Try demo123' };
    }
    
    setUser(userData.user);
    setIsLoading(false);
    return { success: true };
  }, []);

  // Register function - adds new user to mock database
  const register = useCallback(async (
    email: string, 
    password: string, 
    username: string, 
    role: 'player' | 'organizer'
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (mockUsers.has(email.toLowerCase())) {
      setIsLoading(false);
      return { success: false, error: 'Email already registered' };
    }
    
    const newUser: User = {
      id: `u${Date.now()}`,
      email: email.toLowerCase(),
      username,
      avatar: '/placeholder.svg',
      role,
      stats: {
        tournamentsPlayed: 0,
        tournamentsWon: 0,
        totalEarnings: 0,
        rank: role === 'player' ? 'Bronze' : 'N/A'
      }
    };
    
    mockUsers.set(email.toLowerCase(), { user: newUser, password });
    setUser(newUser);
    setIsLoading(false);
    return { success: true };
  }, []);

  // Logout function
  const logout = useCallback(() => {
    setUser(null);
  }, []);

  // Update profile function
  const updateProfile = useCallback((updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
