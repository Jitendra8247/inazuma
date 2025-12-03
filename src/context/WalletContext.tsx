// WalletContext - Manages wallet state and transactions

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Wallet, Transaction, BankDetails } from '@/types/wallet';
import { useAuth } from './AuthContext';

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
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Mock wallet database
const walletsDB = new Map<string, Wallet>();

export function WalletProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [allWallets, setAllWallets] = useState<Map<string, Wallet>>(walletsDB);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize wallet for user
  useEffect(() => {
    if (user) {
      if (!walletsDB.has(user.id)) {
        const newWallet: Wallet = {
          userId: user.id,
          balance: 0,
          transactions: []
        };
        walletsDB.set(user.id, newWallet);
      }
      setWallet(walletsDB.get(user.id) || null);
      setAllWallets(new Map(walletsDB));
    } else {
      setWallet(null);
    }
  }, [user]);

  // Deposit money from bank
  const deposit = useCallback(async (amount: number, bankDetails: BankDetails): Promise<{ success: boolean; error?: string }> => {
    if (!user || !wallet) {
      return { success: false, error: 'User not authenticated' };
    }

    if (amount <= 0) {
      return { success: false, error: 'Amount must be greater than 0' };
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

    const newBalance = wallet.balance + amount;
    const transaction: Transaction = {
      id: `txn_${Date.now()}`,
      userId: user.id,
      type: 'deposit',
      amount,
      balance: newBalance,
      description: `Deposited from ${bankDetails.bankName} (${bankDetails.accountNumber.slice(-4)})`,
      timestamp: new Date()
    };

    const updatedWallet: Wallet = {
      ...wallet,
      balance: newBalance,
      transactions: [transaction, ...wallet.transactions]
    };

    walletsDB.set(user.id, updatedWallet);
    setWallet(updatedWallet);
    setAllWallets(new Map(walletsDB));
    setIsLoading(false);

    return { success: true };
  }, [user, wallet]);

  // Withdraw money to bank
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
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newBalance = wallet.balance - amount;
    const transaction: Transaction = {
      id: `txn_${Date.now()}`,
      userId: user.id,
      type: 'withdraw',
      amount,
      balance: newBalance,
      description: `Withdrawn to ${bankDetails.bankName} (${bankDetails.accountNumber.slice(-4)})`,
      timestamp: new Date()
    };

    const updatedWallet: Wallet = {
      ...wallet,
      balance: newBalance,
      transactions: [transaction, ...wallet.transactions]
    };

    walletsDB.set(user.id, updatedWallet);
    setWallet(updatedWallet);
    setAllWallets(new Map(walletsDB));
    setIsLoading(false);

    return { success: true };
  }, [user, wallet]);

  // Transfer money between users
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

    // Get or create recipient wallet
    let toWallet = walletsDB.get(toUserId);
    if (!toWallet) {
      // Create wallet for recipient if it doesn't exist
      toWallet = {
        userId: toUserId,
        balance: 0,
        transactions: []
      };
      walletsDB.set(toUserId, toWallet);
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Deduct from sender
    const newSenderBalance = wallet.balance - amount;
    const senderTransaction: Transaction = {
      id: `txn_${Date.now()}_send`,
      userId: user.id,
      type: 'transfer_sent',
      amount,
      balance: newSenderBalance,
      description: `Transferred to ${toUserName}`,
      timestamp: new Date(),
      relatedUserId: toUserId,
      relatedUserName: toUserName
    };

    const updatedSenderWallet: Wallet = {
      ...wallet,
      balance: newSenderBalance,
      transactions: [senderTransaction, ...wallet.transactions]
    };

    // Add to receiver
    const newReceiverBalance = toWallet.balance + amount;
    const receiverTransaction: Transaction = {
      id: `txn_${Date.now()}_receive`,
      userId: toUserId,
      type: 'transfer_received',
      amount,
      balance: newReceiverBalance,
      description: `Received from ${user.username}`,
      timestamp: new Date(),
      relatedUserId: user.id,
      relatedUserName: user.username
    };

    const updatedReceiverWallet: Wallet = {
      ...toWallet,
      balance: newReceiverBalance,
      transactions: [receiverTransaction, ...toWallet.transactions]
    };

    walletsDB.set(user.id, updatedSenderWallet);
    walletsDB.set(toUserId, updatedReceiverWallet);
    setWallet(updatedSenderWallet);
    setAllWallets(new Map(walletsDB));
    setIsLoading(false);

    return { success: true };
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

  // Admin: Deduct funds from user (for cheating, etc.)
  const adminDeductFunds = useCallback(async (
    userId: string,
    amount: number,
    reason: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user || user.role !== 'organizer') {
      return { success: false, error: 'Unauthorized' };
    }

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

    if (userWallet.balance < amount) {
      return { success: false, error: 'User has insufficient balance' };
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const newBalance = userWallet.balance - amount;
    const transaction: Transaction = {
      id: `txn_${Date.now()}_admin_deduct`,
      userId,
      type: 'admin_deduction',
      amount,
      balance: newBalance,
      description: `Admin deduction: ${reason}`,
      timestamp: new Date(),
      relatedUserId: user.id,
      relatedUserName: user.username
    };

    const updatedWallet: Wallet = {
      ...userWallet,
      balance: newBalance,
      transactions: [transaction, ...userWallet.transactions]
    };

    walletsDB.set(userId, updatedWallet);
    setAllWallets(new Map(walletsDB));
    setIsLoading(false);

    return { success: true };
  }, [user]);

  // Admin: Add funds to user
  const adminAddFunds = useCallback(async (
    userId: string,
    amount: number,
    reason: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user || user.role !== 'organizer') {
      return { success: false, error: 'Unauthorized' };
    }

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
      id: `txn_${Date.now()}_admin_add`,
      userId,
      type: 'admin_addition',
      amount,
      balance: newBalance,
      description: `Admin addition: ${reason}`,
      timestamp: new Date(),
      relatedUserId: user.id,
      relatedUserName: user.username
    };

    const updatedWallet: Wallet = {
      ...userWallet,
      balance: newBalance,
      transactions: [transaction, ...userWallet.transactions]
    };

    walletsDB.set(userId, updatedWallet);
    setAllWallets(new Map(walletsDB));
    setIsLoading(false);

    return { success: true };
  }, [user]);

  // Get specific user wallet (for admin)
  const getUserWallet = useCallback((userId: string): Wallet | null => {
    return walletsDB.get(userId) || null;
  }, []);

  // Get all wallets (for admin)
  const getAllWallets = useCallback((): Wallet[] => {
    return Array.from(walletsDB.values());
  }, []);

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
      getAllWallets
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
