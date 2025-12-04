// AuthContext - Manages user authentication state and actions

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { User } from '@/data/mockData';
import { authAPI, usersAPI } from '@/services/api';

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
  const [isLoading, setIsLoading] = useState(true); // Start as true while checking auth
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authAPI.getCurrentUser();
          if (response.success && response.user) {
            setUser({
              id: response.user.id,
              email: response.user.email,
              username: response.user.username,
              avatar: response.user.avatar,
              role: response.user.role,
              stats: response.user.stats
            });
          }
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false); // Done checking auth
    };
    checkAuth();
  }, []);

  // Login function - uses real API
  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      const response = await authAPI.login(email, password);
      
      if (response.success && response.user) {
        setUser({
          id: response.user.id,
          email: response.user.email,
          username: response.user.username,
          avatar: response.user.avatar,
          role: response.user.role,
          stats: response.user.stats
        });
        setIsLoading(false);
        return { success: true };
      }
      
      setIsLoading(false);
      return { success: false, error: 'Login failed' };
    } catch (error: any) {
      setIsLoading(false);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Invalid credentials'
      };
    }
  }, []);

  // Register function - uses real API (players only)
  const register = useCallback(async (
    email: string, 
    password: string, 
    username: string, 
    role: 'player' | 'organizer'
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Prevent organizer registration through this function
    if (role === 'organizer') {
      setIsLoading(false);
      return { success: false, error: 'Organizer registration is not available' };
    }
    
    try {
      const response = await authAPI.register({
        username,
        email,
        password,
        role: 'player'
      });
      
      if (response.success && response.user) {
        setUser({
          id: response.user.id,
          email: response.user.email,
          username: response.user.username,
          avatar: response.user.avatar,
          role: response.user.role,
          stats: response.user.stats
        });
        setIsLoading(false);
        return { success: true };
      }
      
      setIsLoading(false);
      return { success: false, error: 'Registration failed' };
    } catch (error: any) {
      setIsLoading(false);
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.errors?.[0]?.msg
        || error.message 
        || 'Registration failed. Please try again.';
      return { 
        success: false, 
        error: errorMessage
      };
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    authAPI.logout();
    setUser(null);
  }, []);

  // Update profile function
  const updateProfile = useCallback((updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  // Get user by ID (synchronous - uses cached data)
  const getUserById = useCallback((userId: string): User | null => {
    // Return from cache
    const cachedUser = allUsers.find(u => u.id === userId);
    return cachedUser || null;
  }, [allUsers]);

  // Get all users (for organizers)
  const getAllUsers = useCallback((): User[] => {
    // Return cached users
    return allUsers;
  }, [allUsers]);

  // Fetch all users if organizer
  useEffect(() => {
    const fetchAllUsers = async () => {
      if (user?.role === 'organizer') {
        try {
          const response = await usersAPI.getAllUsers();
          if (response.success && response.users) {
            setAllUsers(response.users.map((u: any) => ({
              id: u.id || u._id,
              email: u.email,
              username: u.username,
              avatar: u.avatar,
              role: u.role,
              stats: u.stats
            })));
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
    };
    fetchAllUsers();
  }, [user]);

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
