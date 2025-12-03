// Admin Players Page - View and manage all players

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Eye, Trophy, Wallet as WalletIcon, Mail, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useWallet } from '@/context/WalletContext';
import { useTournaments } from '@/context/TournamentContext';
import { Navigate } from 'react-router-dom';
import PlayerDetailsDialog from '@/components/admin/PlayerDetailsDialog';

export default function AdminPlayers() {
  const { user, getAllUsers } = useAuth();
  const { getUserWallet } = useWallet();
  const { getRegistrationsByPlayer } = useTournaments();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  // Redirect if not organizer
  if (!user || user.role !== 'organizer') {
    return <Navigate to="/dashboard" replace />;
  }

  const allUsers = getAllUsers();
  const players = allUsers.filter(u => u.role === 'player');

  // Get player data with wallet and tournament info
  const playersWithData = useMemo(() => {
    return players.map(player => {
      const wallet = getUserWallet(player.id);
      const registrations = getRegistrationsByPlayer(player.id);
      
      return {
        ...player,
        walletBalance: wallet?.balance || 0,
        totalTransactions: wallet?.transactions.length || 0,
        tournamentsRegistered: registrations.length,
        lastTransaction: wallet?.transactions[0]?.timestamp || null
      };
    });
  }, [players, getUserWallet, getRegistrationsByPlayer]);

  // Filter players based on search
  const filteredPlayers = useMemo(() => {
    if (!searchQuery) return playersWithData;
    const query = searchQuery.toLowerCase();
    return playersWithData.filter(p =>
      p.username.toLowerCase().includes(query) ||
      p.email.toLowerCase().includes(query) ||
      p.id.toLowerCase().includes(query)
    );
  }, [playersWithData, searchQuery]);

  // Calculate stats
  const totalPlayers = players.length;
  const totalWalletBalance = playersWithData.reduce((sum, p) => sum + p.walletBalance, 0);
  const activePlayers = playersWithData.filter(p => p.tournamentsRegistered > 0).length;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Players Management</h1>
          <p className="text-muted-foreground">View and manage all registered players</p>
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
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Players</p>
                <p className="font-display text-2xl font-bold">{totalPlayers}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Players</p>
                <p className="font-display text-2xl font-bold">{activePlayers}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                <WalletIcon className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total in Wallets</p>
                <p className="font-display text-2xl font-bold">₹{totalWalletBalance.toLocaleString('en-IN')}</p>
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

        {/* Players List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {filteredPlayers.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No players found</p>
            </Card>
          ) : (
            filteredPlayers.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{player.username}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {player.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Trophy className="h-3 w-3" />
                            {player.tournamentsRegistered} tournaments
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Wallet Balance</p>
                        <p className="font-display text-xl font-bold text-primary">
                          ₹{player.walletBalance.toLocaleString('en-IN')}
                        </p>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedPlayer(player.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* Player Details Dialog */}
      {selectedPlayer && (
        <PlayerDetailsDialog
          open={!!selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          playerId={selectedPlayer}
        />
      )}
    </div>
  );
}
