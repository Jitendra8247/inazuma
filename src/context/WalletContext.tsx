// WalletContext - Manages wallet state and transactions

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Wallet, Transaction, BankDetails } from '@/types/wallet';
import { useAuth } from './AuthContext';
import { walletsAPI, transactionsAPI } from '@/services/api';

interface WalletContextType {
  wallet: Wallet | null;
  allWallets: Map<string, Wallet>;
  isLoading: boolean;
  deposit: (amount: number, bankDetails: BankDetails) => Promise<{ success: boolean; error?: string }>;
  withdraw: (amount: number, bankDetails: BankDetails) => Promise<{ success: boolean; error?: string }>;
  transfer: (toUserId: string, toUserName: string, amount: number) => Promise<{ success: boolean; error?: string }>;
  deductTournamentFee: (tournamentId: string, tournamentName: string, fee: number, organizerId: string) => Promise<{ success: boolean; error?: string }>;
  addPrize: (userId: string, amount: number, tournamentId: string, tournamentName: string) => Promise<{ success: boolean; error?: string }>;
  adminDeductFunds: (userId: string, amount: number, reason: string) => Promise<{ success: boolean; error?: string }>;
  adminAddFunds: (userId: string, amount: number, reason: string) => Promise<{ success: boolean; error?: string }>;
  getUserWallet: (userId: string) => Wallet | null;
  getAllWallets: () => Wallet[];
  refreshWallet: () => Promise<void>;
  refreshAllWallets: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Mock wallet database
const walletsDB = new Map<string, Wallet>();

export function WalletProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [allWallets, setAllWallets] = useState<Map<string, Wallet>>(walletsDB);
  const [isLoading, setIsLoading] = useState(false);

  // Function to refresh wallet data
  const refreshWallet = useCallback(async () => {
    if (!user) {
      setWallet(null);
      return;
    }

    try {
      const response = await walletsAPI.getMyWallet();
      if (response.success && response.wallet) {
        // Fetch transactions
        const txnResponse = await transactionsAPI.getMyTransactions(50, 1);
        const transactions = txnResponse.success ? txnResponse.transactions : [];
        
        setWallet({
          userId: response.wallet.userId || response.wallet._id,
          balance: response.wallet.balance,
          transactions: transactions
        });
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
    }
  }, [user]);

  // Fetch wallet from API when user logs in
  useEffect(() => {
    refreshWallet();
  }, [refreshWallet]);

  // Deposit money from bank - uses API
  const deposit = useCallback(async (amount: number, bankDetails: BankDetails): Promise<{ success: boolean; error?: string }> => {
    if (!user || !wallet) {
      return { success: false, error: 'User not authenticated' };
    }

    if (amount <= 0) {
      return { success: false, error: 'Amount must be greater than 0' };
    }

    setIsLoading(true);

    try {
      const response = await walletsAPI.deposit(amount, bankDetails);
      
      if (response.success && response.wallet) {
        // Fetch updated transactions
        const txnResponse = await transactionsAPI.getMyTransactions(50, 1);
        const transactions = txnResponse.success ? txnResponse.transactions : [];
        
        setWallet({
          userId: response.wallet.userId || response.wallet._id,
          balance: response.wallet.balance,
          transactions: transactions
        });
        setIsLoading(false);
        return { success: true };
      }
      
      setIsLoading(false);
      return { success: false, error: 'Deposit failed' };
    } catch (error: any) {
      setIsLoading(false);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Deposit failed'
      };
    }
  }, [user, wallet]);

  // Withdraw money to bank - uses API
  const withdraw = useCallback(async (amount: number, bankDetails: BankDetails): Promise<{ success: boolean; error?: string }> => {
    if (!user || !wallet) {
      return { success: false, error: 'User not authenticated' };
    }

    if (amount <= 0) {
      return { success: false, error: 'Amount must be greater than 0' };
    }

    if (wallet.balance < amount) {
      return { success: false, error: 'Insufficient balance' };
    }

    setIsLoading(true);

    try {
      const response = await walletsAPI.withdraw(amount, bankDetails);
      
      if (response.success && response.wallet) {
        // Fetch updated transactions
        const txnResponse = await transactionsAPI.getMyTransactions(50, 1);
        const transactions = txnResponse.success ? txnResponse.transactions : [];
        
        setWallet({
          userId: response.wallet.userId || response.wallet._id,
          balance: response.wallet.balance,
          transactions: transactions
        });
        setIsLoading(false);
        return { success: true };
      }
      
      setIsLoading(false);
      return { success: false, error: 'Withdrawal failed' };
    } catch (error: any) {
      setIsLoading(false);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Withdrawal failed'
      };
    }
  }, [user, wallet]);

  // Transfer money between users - uses API
  const transfer = useCallback(async (toUserId: string, toUserName: string, amount: number): Promise<{ success: boolean; error?: string }> => {
    if (!user || !wallet) {
      return { success: false, error: 'User not authenticated' };
    }

    if (amount <= 0) {
      return { success: false, error: 'Amount must be greater than 0' };
    }

    if (wallet.balance < amount) {
      return { success: false, error: 'Insufficient balance' };
    }

    if (toUserId === user.id) {
      return { success: false, error: 'Cannot transfer to yourself' };
    }

    setIsLoading(true);

    try {
      const response = await walletsAPI.transfer(toUserId, amount);
      
      if (response.success && response.wallet) {
        // Fetch updated transactions
        const txnResponse = await transactionsAPI.getMyTransactions(50, 1);
        const transactions = txnResponse.success ? txnResponse.transactions : [];
        
        setWallet({
          userId: response.wallet.userId || response.wallet._id,
          balance: response.wallet.balance,
          transactions: transactions
        });
        setIsLoading(false);
        return { success: true };
      }
      
      setIsLoading(false);
      return { success: false, error: 'Transfer failed' };
    } catch (error: any) {
      setIsLoading(false);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Transfer failed'
      };
    }
  }, [user, wallet]);

  // Deduct tournament fee and transfer to organizer
  const deductTournamentFee = useCallback(async (
    tournamentId: string,
    tournamentName: string,
    fee: number,
    organizerId: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user || !wallet) {
      return { success: false, error: 'User not authenticated' };
    }

    if (wallet.balance < fee) {
      return { success: false, error: 'Insufficient balance' };
    }

    // Get or create organizer wallet
    let organizerWallet = walletsDB.get(organizerId);
    if (!organizerWallet) {
      // Create wallet for organizer if it doesn't exist
      organizerWallet = {
        userId: organizerId,
        balance: 0,
        transactions: []
      };
      walletsDB.set(organizerId, organizerWallet);
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    // Deduct from player
    const newPlayerBalance = wallet.balance - fee;
    const playerTransaction: Transaction = {
      id: `txn_${Date.now()}_fee`,
      userId: user.id,
      type: 'tournament_fee',
      amount: fee,
      balance: newPlayerBalance,
      description: `Registration fee for ${tournamentName}`,
      timestamp: new Date(),
      tournamentId,
      tournamentName
    };

    const updatedPlayerWallet: Wallet = {
      ...wallet,
      balance: newPlayerBalance,
      transactions: [playerTransaction, ...wallet.transactions]
    };

    // Add to organizer
    const newOrganizerBalance = organizerWallet.balance + fee;
    const organizerTransaction: Transaction = {
      id: `txn_${Date.now()}_fee_received`,
      userId: organizerId,
      type: 'tournament_fee',
      amount: fee,
      balance: newOrganizerBalance,
      description: `Registration fee from ${user.username} for ${tournamentName}`,
      timestamp: new Date(),
      tournamentId,
      tournamentName,
      relatedUserId: user.id,
      relatedUserName: user.username
    };

    const updatedOrganizerWallet: Wallet = {
      ...organizerWallet,
      balance: newOrganizerBalance,
      transactions: [organizerTransaction, ...organizerWallet.transactions]
    };

    walletsDB.set(user.id, updatedPlayerWallet);
    walletsDB.set(organizerId, updatedOrganizerWallet);
    setWallet(updatedPlayerWallet);
    setAllWallets(new Map(walletsDB));
    setIsLoading(false);

    return { success: true };
  }, [user, wallet]);

  // Add prize money to player
  const addPrize = useCallback(async (
    userId: string,
    amount: number,
    tournamentId: string,
    tournamentName: string
  ): Promise<{ success: boolean; error?: string }> => {
    // Get or create user wallet
    let userWallet = walletsDB.get(userId);
    if (!userWallet) {
      // Create wallet for user if it doesn't exist
      userWallet = {
        userId,
        balance: 0,
        transactions: []
      };
      walletsDB.set(userId, userWallet);
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const newBalance = userWallet.balance + amount;
    const transaction: Transaction = {
      id: `txn_${Date.now()}_prize`,
      userId,
      type: 'tournament_prize',
      amount,
      balance: newBalance,
      description: `Prize money from ${tournamentName}`,
      timestamp: new Date(),
      tournamentId,
      tournamentName
    };

    const updatedWallet: Wallet = {
      ...userWallet,
      balance: newBalance,
      transactions: [transaction, ...userWallet.transactions]
    };

    walletsDB.set(userId, updatedWallet);
    if (user?.id === userId) {
      setWallet(updatedWallet);
    }
    setAllWallets(new Map(walletsDB));
    setIsLoading(false);

    return { success: true };
  }, [user]);

  // Admin: Deduct funds from user - uses API
  const adminDeductFunds = useCallback(async (
    userId: string,
    amount: number,
    reason: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user || user.role !== 'organizer') {
      return { success: false, error: 'Unauthorized' };
    }

    setIsLoading(true);

    try {
      const response = await walletsAPI.adminDeductFunds(userId, amount, reason);
      
      if (response.success) {
        // Manually refresh all wallets
        try {
          const walletsResponse = await walletsAPI.getAllWallets();
          if (walletsResponse.success && walletsResponse.wallets) {
            const walletsMap = new Map<string, Wallet>();
            
            for (const w of walletsResponse.wallets) {
              const walletUserId = typeof w.userId === 'object' ? w.userId._id : w.userId;
              
              try {
                const txnResponse = await transactionsAPI.getUserTransactions(walletUserId);
                const transactions = txnResponse.success ? txnResponse.transactions : [];
                
                walletsMap.set(walletUserId, {
                  userId: walletUserId,
                  balance: w.balance,
                  transactions: transactions,
                  userInfo: typeof w.userId === 'object' ? {
                    username: w.userId.username,
                    email: w.userId.email,
                    role: w.userId.role
                  } : undefined
                });
              } catch (error) {
                walletsMap.set(walletUserId, {
                  userId: walletUserId,
                  balance: w.balance,
                  transactions: [],
                  userInfo: typeof w.userId === 'object' ? {
                    username: w.userId.username,
                    email: w.userId.email,
                    role: w.userId.role
                  } : undefined
                });
              }
            }
            
            setAllWallets(walletsMap);
          }
        } catch (error) {
          console.error('Error refreshing wallets:', error);
        }
        
        setIsLoading(false);
        return { success: true };
      }
      
      setIsLoading(false);
      return { success: false, error: 'Deduction failed' };
    } catch (error: any) {
      setIsLoading(false);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Deduction failed'
      };
    }
  }, [user]);

  // Admin: Add funds to user - uses API
  const adminAddFunds = useCallback(async (
    userId: string,
    amount: number,
    reason: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user || user.role !== 'organizer') {
      return { success: false, error: 'Unauthorized' };
    }

    setIsLoading(true);

    try {
      const response = await walletsAPI.adminAddFunds(userId, amount, reason);
      
      if (response.success) {
        // Manually refresh all wallets
        try {
          const walletsResponse = await walletsAPI.getAllWallets();
          if (walletsResponse.success && walletsResponse.wallets) {
            const walletsMap = new Map<string, Wallet>();
            
            for (const w of walletsResponse.wallets) {
              const walletUserId = typeof w.userId === 'object' ? w.userId._id : w.userId;
              
              try {
                const txnResponse = await transactionsAPI.getUserTransactions(walletUserId);
                const transactions = txnResponse.success ? txnResponse.transactions : [];
                
                walletsMap.set(walletUserId, {
                  userId: walletUserId,
                  balance: w.balance,
                  transactions: transactions,
                  userInfo: typeof w.userId === 'object' ? {
                    username: w.userId.username,
                    email: w.userId.email,
                    role: w.userId.role
                  } : undefined
                });
              } catch (error) {
                walletsMap.set(walletUserId, {
                  userId: walletUserId,
                  balance: w.balance,
                  transactions: [],
                  userInfo: typeof w.userId === 'object' ? {
                    username: w.userId.username,
                    email: w.userId.email,
                    role: w.userId.role
                  } : undefined
                });
              }
            }
            
            setAllWallets(walletsMap);
          }
        } catch (error) {
          console.error('Error refreshing wallets:', error);
        }
        
        setIsLoading(false);
        return { success: true };
      }
      
      setIsLoading(false);
      return { success: false, error: 'Addition failed' };
    } catch (error: any) {
      setIsLoading(false);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Addition failed'
      };
    }
  }, [user]);

  // Get specific user wallet (for admin) - uses cached data
  const getUserWallet = useCallback((userId: string): Wallet | null => {
    // Return from allWallets map
    return allWallets.get(userId) || null;
  }, [allWallets]);

  // Get all wallets (for admin) - uses cached data
  const getAllWallets = useCallback((): Wallet[] => {
    return Array.from(allWallets.values());
  }, [allWallets]);

  // Function to refresh all wallets (for organizers)
  const refreshAllWallets = useCallback(async () => {
    if (!user || user.role !== 'organizer') return;

    try {
      const response = await walletsAPI.getAllWallets();
      if (response.success && response.wallets) {
        const walletsMap = new Map<string, Wallet>();
        
        for (const w of response.wallets) {
          // Extract userId - it might be populated with user object or just an ID
          const userId = typeof w.userId === 'object' ? w.userId._id : w.userId;
          
          // Fetch transactions for each wallet
          try {
            const txnResponse = await transactionsAPI.getUserTransactions(userId);
            const transactions = txnResponse.success ? txnResponse.transactions : [];
            
            walletsMap.set(userId, {
              userId: userId,
              balance: w.balance,
              transactions: transactions,
              // Store user info if populated
              userInfo: typeof w.userId === 'object' ? {
                username: w.userId.username,
                email: w.userId.email,
                role: w.userId.role
              } : undefined
            });
          } catch (error) {
            // If transaction fetch fails, just use wallet without transactions
            walletsMap.set(userId, {
              userId: userId,
              balance: w.balance,
              transactions: [],
              userInfo: typeof w.userId === 'object' ? {
                username: w.userId.username,
                email: w.userId.email,
                role: w.userId.role
              } : undefined
            });
          }
        }
        
        setAllWallets(walletsMap);
      }
    } catch (error) {
      console.error('Error fetching all wallets:', error);
    }
  }, [user]);

  // Fetch all wallets for organizers on mount and when user changes
  useEffect(() => {
    refreshAllWallets();
  }, [refreshAllWallets]);

  return (
    <WalletContext.Provider value={{
      wallet,
      allWallets,
      isLoading,
      deposit,
      withdraw,
      transfer,
      deductTournamentFee,
      addPrize,
      adminDeductFunds,
      adminAddFunds,
      getUserWallet,
      getAllWallets,
      refreshWallet,
      refreshAllWallets
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
