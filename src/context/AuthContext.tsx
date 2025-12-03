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
  getUserById: (userId: string) => User | null;
  getAllUsers: () => User[];
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
  }]
]);

// Hardcoded organizer credentials (admin only - not available through UI registration)
const ORGANIZER_CREDENTIALS = new Map([
  ['admin@inazuma.com', {
    password: 'Admin@2024',
    user: {
      id: 'org1',
      email: 'admin@inazuma.com',
      username: 'AdminOrganizer',
      avatar: '/placeholder.svg',
      role: 'organizer' as const,
      stats: {
        tournamentsPlayed: 0,
        tournamentsWon: 0,
        totalEarnings: 0,
        rank: 'N/A'
      }
    }
  }],
  ['organizer@demo.com', {
    password: 'Organizer@123',
    user: {
      id: 'org2',
      email: 'organizer@demo.com',
      username: 'DemoOrganizer',
      avatar: '/placeholder.svg',
      role: 'organizer' as const,
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

  // Login function - validates against mock database and hardcoded organizers
  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check hardcoded organizer credentials first
    const organizerData = ORGANIZER_CREDENTIALS.get(email.toLowerCase());
    if (organizerData) {
      if (organizerData.password !== password) {
        setIsLoading(false);
        return { success: false, error: 'Incorrect password' };
      }
      setUser(organizerData.user);
      setIsLoading(false);
      return { success: true };
    }
    
    // Check regular user database
    const userData = mockUsers.get(email.toLowerCase());
    
    if (!userData) {
      setIsLoading(false);
      return { success: false, error: 'User not found' };
    }
    
    if (userData.password !== password) {
      setIsLoading(false);
      return { success: false, error: 'Incorrect password' };
    }
    
    setUser(userData.user);
    setIsLoading(false);
    return { success: true };
  }, []);

  // Register function - adds new user to mock database (players only)
  const register = useCallback(async (
    email: string, 
    password: string, 
    username: string, 
    role: 'player' | 'organizer'
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Prevent organizer registration through this function
    if (role === 'organizer') {
      setIsLoading(false);
      return { success: false, error: 'Organizer registration is not available' };
    }
    
    // Check if email is already registered (including hardcoded organizers)
    if (mockUsers.has(email.toLowerCase()) || ORGANIZER_CREDENTIALS.has(email.toLowerCase())) {
      setIsLoading(false);
      return { success: false, error: 'Email already registered' };
    }
    
    const newUser: User = {
      id: `u${Date.now()}`,
      email: email.toLowerCase(),
      username,
      avatar: '/placeholder.svg',
      role: 'player',
      stats: {
        tournamentsPlayed: 0,
        tournamentsWon: 0,
        totalEarnings: 0,
        rank: 'Bronze'
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

  // Get user by ID
  const getUserById = useCallback((userId: string): User | null => {
    // Check regular users
    for (const [, userData] of mockUsers) {
      if (userData.user.id === userId) {
        return userData.user;
      }
    }
    // Check organizers
    for (const [, userData] of ORGANIZER_CREDENTIALS) {
      if (userData.user.id === userId) {
        return userData.user;
      }
    }
    return null;
  }, []);

  // Get all users
  const getAllUsers = useCallback((): User[] => {
    const users: User[] = [];
    // Add regular users
    for (const [, userData] of mockUsers) {
      users.push(userData.user);
    }
    // Add organizers
    for (const [, userData] of ORGANIZER_CREDENTIALS) {
      users.push(userData.user);
    }
    return users;
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      updateProfile,
      getUserById,
      getAllUsers
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
