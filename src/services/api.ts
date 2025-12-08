// API Service - Connects frontend to backend
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🔧 API Configuration:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  API_URL: API_URL,
  mode: import.meta.env.MODE
});

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if not already on login page and not during login attempt
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      const isOnLoginPage = window.location.pathname === '/login';
      
      if (!isLoginRequest && !isOnLoginPage) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: { username: string; email: string; password: string; role?: string }) => {
    const response = await api.post('/auth/register', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  login: async (email: string, password: string) => {
    console.log('🔐 Attempting login to:', `${API_URL}/auth/login`);
    try {
      const response = await api.post('/auth/login', { email, password });
      console.log('✅ Login response:', response.data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error: any) {
      console.error('❌ Login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      throw error;
    }
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

// Users API
export const usersAPI = {
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, data: any) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },
};

// Tournaments API
export const tournamentsAPI = {
  getAllTournaments: async (filters?: { status?: string; game?: string; mode?: string; includeArchived?: string }) => {
    const response = await api.get('/tournaments', { params: filters });
    return response.data;
  },

  getMyTournaments: async () => {
    const response = await api.get('/tournaments/my-tournaments');
    return response.data;
  },

  getTournamentById: async (id: string) => {
    const response = await api.get(`/tournaments/${id}`);
    return response.data;
  },

  createTournament: async (data: any) => {
    const response = await api.post('/tournaments', data);
    return response.data;
  },

  updateTournament: async (id: string, data: any) => {
    const response = await api.put(`/tournaments/${id}`, data);
    return response.data;
  },

  updateRoomCredentials: async (id: string, roomId: string, roomPassword: string) => {
    const response = await api.put(`/tournaments/${id}/room-credentials`, { roomId, roomPassword });
    return response.data;
  },

  deleteTournament: async (id: string) => {
    const response = await api.delete(`/tournaments/${id}`);
    return response.data;
  },
};

// Registrations API
export const registrationsAPI = {
  registerForTournament: async (data: any) => {
    const response = await api.post('/registrations', data);
    return response.data;
  },

  getMyRegistrations: async () => {
    const response = await api.get('/registrations/my');
    return response.data;
  },

  getTournamentRegistrations: async (tournamentId: string) => {
    const response = await api.get(`/registrations/tournament/${tournamentId}`);
    return response.data;
  },
};

// Wallets API
export const walletsAPI = {
  getMyWallet: async () => {
    const response = await api.get('/wallets/my');
    return response.data;
  },

  getAllWallets: async () => {
    const response = await api.get('/wallets/all');
    return response.data;
  },

  deposit: async (amount: number, bankDetails: any) => {
    const response = await api.post('/wallets/deposit', { amount, bankDetails });
    return response.data;
  },

  withdraw: async (amount: number, bankDetails: any) => {
    const response = await api.post('/wallets/withdraw', { amount, bankDetails });
    return response.data;
  },

  transfer: async (toUserId: string, amount: number) => {
    const response = await api.post('/wallets/transfer', { toUserId, amount });
    return response.data;
  },

  adminAddFunds: async (userId: string, amount: number, reason: string) => {
    const response = await api.post('/wallets/admin/add', { userId, amount, reason });
    return response.data;
  },

  adminDeductFunds: async (userId: string, amount: number, reason: string) => {
    const response = await api.post('/wallets/admin/deduct', { userId, amount, reason });
    return response.data;
  },
};

// Transactions API
export const transactionsAPI = {
  getMyTransactions: async (limit = 50, page = 1) => {
    const response = await api.get('/transactions/my', { params: { limit, page } });
    return response.data;
  },

  getUserTransactions: async (userId: string) => {
    const response = await api.get(`/transactions/user/${userId}`);
    return response.data;
  },

  getAllTransactions: async (limit = 100, page = 1) => {
    const response = await api.get('/transactions/all', { params: { limit, page } });
    return response.data;
  },
};

// Password Reset API
export const passwordResetAPI = {
  verifyUser: async (email: string, username: string) => {
    const response = await api.post('/password-reset/verify-user', { email, username });
    return response.data;
  },

  verifyToken: async (token: string) => {
    const response = await api.post('/password-reset/verify', { token });
    return response.data;
  },

  resetPassword: async (token: string, password: string) => {
    const response = await api.post('/password-reset/reset', { token, password });
    return response.data;
  },
};

export default api;
