// Player Details Dialog - View complete player information

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useWallet } from '@/context/WalletContext';
import { useTournaments } from '@/context/TournamentContext';
import { 
  User, Mail, Trophy, Wallet as WalletIcon, 
  Calendar, TrendingUp, Award, History, 
  ArrowUpRight, ArrowDownLeft, Send 
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface PlayerDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  playerId: string;
}

export default function PlayerDetailsDialog({ open, onClose, playerId }: PlayerDetailsDialogProps) {
  const { getUserById } = useAuth();
  const { getUserWallet } = useWallet();
  const { getRegistrationsByPlayer, getTournamentById } = useTournaments();

  const player = getUserById(playerId);
  const wallet = getUserWallet(playerId);
  const registrations = getRegistrationsByPlayer(playerId);

  if (!player) {
    return null;
  }

  const tournaments = registrations
    .map(reg => getTournamentById(reg.tournamentId))
    .filter(t => t !== null);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'transfer_received':
      case 'tournament_prize':
      case 'admin_addition':
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case 'withdraw':
      case 'transfer_sent':
      case 'tournament_fee':
      case 'admin_deduction':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      default:
        return <Send className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTransactionColor = (type: string) => {
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

  const getAmountPrefix = (type: string) => {
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Player Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Player Info */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold">{player.username}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {player.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      {player.stats.rank}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">User ID</p>
                <p className="font-mono text-sm font-semibold">{player.id}</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Tournaments Played</p>
                <p className="font-display text-xl font-bold">{player.stats.tournamentsPlayed}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Tournaments Won</p>
                <p className="font-display text-xl font-bold text-accent">{player.stats.tournamentsWon}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Total Earnings</p>
                <p className="font-display text-xl font-bold text-green-500">
                  ₹{player.stats.totalEarnings.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Wallet Balance</p>
                <p className="font-display text-xl font-bold text-primary">
                  ₹{wallet?.balance.toLocaleString('en-IN') || 0}
                </p>
              </div>
            </div>
          </Card>

          {/* Registered Tournaments */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-primary" />
              <h3 className="font-display text-lg font-bold">Registered Tournaments</h3>
              <span className="text-sm text-muted-foreground">({registrations.length})</span>
            </div>

            {registrations.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No tournament registrations yet
              </p>
            ) : (
              <div className="space-y-3">
                {registrations.slice(0, 5).map((reg) => {
                  const tournament = getTournamentById(reg.tournamentId);
                  if (!tournament) return null;

                  return (
                    <div
                      key={reg.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-semibold">{tournament.name}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span>Team: {reg.teamName}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(reg.registeredAt), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" asChild>
                        <Link to={`/tournaments/${tournament.id}`}>View</Link>
                      </Button>
                    </div>
                  );
                })}
                {registrations.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    And {registrations.length - 5} more...
                  </p>
                )}
              </div>
            )}
          </Card>

          {/* Recent Transactions */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <History className="h-5 w-5 text-primary" />
              <h3 className="font-display text-lg font-bold">Recent Transactions</h3>
              <span className="text-sm text-muted-foreground">
                ({wallet?.transactions.length || 0})
              </span>
            </div>

            {!wallet || wallet.transactions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No transactions yet
              </p>
            ) : (
              <div className="space-y-2">
                {wallet.transactions.slice(0, 10).map((txn) => (
                  <div
                    key={txn.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center">
                        {getTransactionIcon(txn.type)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{txn.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(txn.timestamp), 'MMM dd, yyyy • hh:mm a')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${getTransactionColor(txn.type)}`}>
                        {getAmountPrefix(txn.type)}₹{txn.amount.toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Bal: ₹{txn.balance.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
                {wallet.transactions.length > 10 && (
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    And {wallet.transactions.length - 10} more transactions...
                  </p>
                )}
              </div>
            )}
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" asChild>
              <Link to="/admin/wallets">Manage Wallet</Link>
            </Button>
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
