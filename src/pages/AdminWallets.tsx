// Admin Wallets Page - Manage all user wallets

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Wallet as WalletIcon, Search, Edit, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useWallet } from '@/context/WalletContext';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminWalletDialog from '@/components/wallet/AdminWalletDialog';

export default function AdminWallets() {
  const { getAllWallets, allWallets } = useWallet();
  const { user, getUserById } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWallet, setSelectedWallet] = useState<{ userId: string; username: string } | null>(null);
  const [actionType, setActionType] = useState<'add' | 'deduct'>('add');

  // Redirect if not organizer
  if (!user || user.role !== 'organizer') {
    return <Navigate to="/dashboard" replace />;
  }

  const wallets = getAllWallets();

  // Get user info from AuthContext
  const walletsWithUserInfo = useMemo(() => {
    return wallets.map(wallet => {
      const userInfo = getUserById(wallet.userId);
      return {
        ...wallet,
        username: userInfo?.username || `User_${wallet.userId.slice(0, 8)}`,
        email: userInfo?.email || `user${wallet.userId.slice(0, 4)}@example.com`
      };
    });
  }, [wallets, getUserById]);

  const filteredWallets = useMemo(() => {
    if (!searchQuery) return walletsWithUserInfo;
    const query = searchQuery.toLowerCase();
    return walletsWithUserInfo.filter(w =>
      w.username.toLowerCase().includes(query) ||
      w.email.toLowerCase().includes(query) ||
      w.userId.toLowerCase().includes(query)
    );
  }, [walletsWithUserInfo, searchQuery]);

  const totalBalance = useMemo(() => {
    return wallets.reduce((sum, w) => sum + w.balance, 0);
  }, [wallets]);

  const handleManageWallet = (userId: string, username: string, type: 'add' | 'deduct') => {
    setSelectedWallet({ userId, username });
    setActionType(type);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Wallet Management</h1>
          <p className="text-muted-foreground">Manage all user wallets and transactions</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <WalletIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Wallets</p>
                <p className="font-display text-2xl font-bold">{wallets.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <Plus className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Balance</p>
                <p className="font-display text-2xl font-bold">₹{totalBalance.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                <WalletIcon className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your Balance</p>
                <p className="font-display text-2xl font-bold">
                  ₹{(allWallets.get(user.id)?.balance || 0).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by username, email, or user ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Wallets List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {filteredWallets.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No wallets found</p>
            </Card>
          ) : (
            filteredWallets.map((wallet, index) => (
              <motion.div
                key={wallet.userId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <WalletIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{wallet.username}</h3>
                        <p className="text-sm text-muted-foreground">{wallet.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {wallet.transactions.length} transactions
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Balance</p>
                        <p className="font-display text-xl font-bold text-primary">
                          ₹{wallet.balance.toLocaleString('en-IN')}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleManageWallet(wallet.userId, wallet.username, 'add')}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleManageWallet(wallet.userId, wallet.username, 'deduct')}
                        >
                          <Minus className="h-4 w-4 mr-1" />
                          Deduct
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* Admin Wallet Dialog */}
      {selectedWallet && (
        <AdminWalletDialog
          open={!!selectedWallet}
          onClose={() => setSelectedWallet(null)}
          userId={selectedWallet.userId}
          username={selectedWallet.username}
          actionType={actionType}
        />
      )}
    </div>
  );
}
