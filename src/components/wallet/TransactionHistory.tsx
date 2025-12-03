// Transaction History Component

import { Card } from '@/components/ui/card';
import { Transaction } from '@/types/wallet';
import { ArrowUpRight, ArrowDownLeft, Send, Trophy, AlertCircle, Plus, Minus } from 'lucide-react';
import { format } from 'date-fns';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="h-5 w-5 text-green-500" />;
      case 'withdraw':
        return <ArrowUpRight className="h-5 w-5 text-red-500" />;
      case 'transfer_sent':
        return <Send className="h-5 w-5 text-blue-500" />;
      case 'transfer_received':
        return <ArrowDownLeft className="h-5 w-5 text-green-500" />;
      case 'tournament_fee':
        return <Trophy className="h-5 w-5 text-orange-500" />;
      case 'tournament_prize':
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 'admin_deduction':
        return <Minus className="h-5 w-5 text-red-500" />;
      case 'admin_addition':
        return <Plus className="h-5 w-5 text-green-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
      case 'transfer_received':
      case 'tournament_prize':
      case 'admin_addition':
        return 'text-green-500';
      case 'withdraw':
      case 'transfer_sent':
      case 'tournament_fee':
      case 'admin_deduction':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getAmountPrefix = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
      case 'transfer_received':
      case 'tournament_prize':
      case 'admin_addition':
        return '+';
      case 'withdraw':
      case 'transfer_sent':
      case 'tournament_fee':
      case 'admin_deduction':
        return '-';
      default:
        return '';
    }
  };

  if (transactions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No transactions yet</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="font-display text-xl font-bold mb-4">Transaction History</h3>
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                {getTransactionIcon(transaction.type)}
              </div>
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(transaction.timestamp), 'MMM dd, yyyy • hh:mm a')}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className={`font-bold ${getTransactionColor(transaction.type)}`}>
                {getAmountPrefix(transaction.type)}₹{transaction.amount.toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-muted-foreground">
                Balance: ₹{transaction.balance.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
