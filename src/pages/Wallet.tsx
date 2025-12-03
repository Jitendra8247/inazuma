// Wallet Page - Player wallet management

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Send, Plus, Minus, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useWallet } from '@/context/WalletContext';
import { useAuth } from '@/context/AuthContext';
import DepositDialog from '@/components/wallet/DepositDialog';
import WithdrawDialog from '@/components/wallet/WithdrawDialog';
import TransferDialog from '@/components/wallet/TransferDialog';
import TransactionHistory from '@/components/wallet/TransactionHistory';

export default function Wallet() {
  const { wallet } = useWallet();
  const { user } = useAuth();
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);

  if (!wallet || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading wallet...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">My Wallet</h1>
          <p className="text-muted-foreground">Manage your funds and transactions</p>
        </motion.div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 md:p-8 mb-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <WalletIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">
                  ₹{wallet.balance.toLocaleString('en-IN')}
                </h2>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <Button
                variant="outline"
                className="flex flex-col gap-2 h-auto py-4"
                onClick={() => setShowDeposit(true)}
              >
                <Plus className="h-5 w-5 text-green-500" />
                <span className="text-xs">Deposit</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col gap-2 h-auto py-4"
                onClick={() => setShowWithdraw(true)}
              >
                <Minus className="h-5 w-5 text-red-500" />
                <span className="text-xs">Withdraw</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col gap-2 h-auto py-4"
                onClick={() => setShowTransfer(true)}
              >
                <Send className="h-5 w-5 text-blue-500" />
                <span className="text-xs">Transfer</span>
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <TransactionHistory transactions={wallet.transactions} />
        </motion.div>
      </div>

      {/* Dialogs */}
      <DepositDialog open={showDeposit} onClose={() => setShowDeposit(false)} />
      <WithdrawDialog open={showWithdraw} onClose={() => setShowWithdraw(false)} />
      <TransferDialog open={showTransfer} onClose={() => setShowTransfer(false)} />
    </div>
  );
}
