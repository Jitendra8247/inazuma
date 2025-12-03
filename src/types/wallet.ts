// Wallet types and interfaces

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdraw' | 'transfer_sent' | 'transfer_received' | 'tournament_fee' | 'tournament_prize' | 'admin_deduction' | 'admin_addition';
  amount: number;
  balance: number;
  description: string;
  timestamp: Date;
  relatedUserId?: string; // For transfers
  relatedUserName?: string;
  tournamentId?: string;
  tournamentName?: string;
}

export interface Wallet {
  userId: string;
  balance: number;
  transactions: Transaction[];
}

export interface BankDetails {
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  bankName: string;
}
