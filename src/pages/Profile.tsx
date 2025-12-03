// Profile Page - User profile with editable info and performance stats

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Trophy, Target, Gamepad2, 
  Wallet, Edit2, Save, X, Award, Copy 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import StatsCard from '@/components/dashboard/StatsCard';
import { useAuth } from '@/context/AuthContext';
import { useTournaments } from '@/context/TournamentContext';
import { useToast } from '@/hooks/use-toast';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { getRegistrationsByPlayer } = useTournaments();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(user?.username || '');

  const handleCopyUserId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      toast({
        title: 'User ID Copied',
        description: 'Your User ID has been copied to clipboard'
      });
    }
  };

  const registrations = getRegistrationsByPlayer(user?.id || '');

  // Mock performance stats
  const performanceStats = {
    totalKills: 2456,
    avgKillsPerMatch: 8.5,
    winRate: '23%',
    topTenRate: '45%',
    avgDamage: 1250,
    avgSurvivalTime: '18:30'
  };

  const handleSaveProfile = () => {
    updateProfile({ username: editedUsername });
    setIsEditing(false);
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been updated successfully.',
    });
  };

  const getRankBadge = (rank: string) => {
    const rankColors: Record<string, string> = {
      'Conqueror': 'from-neon-orange to-destructive',
      'Ace': 'from-neon-magenta to-secondary',
      'Crown': 'from-primary to-neon-cyan',
      'Diamond': 'from-neon-purple to-secondary',
      'Platinum': 'from-muted to-border',
      'Gold': 'from-neon-orange to-yellow-600',
      'Bronze': 'from-orange-700 to-orange-900'
    };
    return rankColors[rank] || 'from-muted to-border';
  };

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-lg bg-card border border-border/50 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                <span className="font-display text-3xl font-bold text-primary">
                  {user?.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r ${getRankBadge(user?.stats.rank || 'Bronze')}`}>
                <span className="text-xs font-bold text-white">{user?.stats.rank}</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={editedUsername}
                      onChange={(e) => setEditedUsername(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveProfile}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="font-display text-2xl font-bold">{user?.username}</h1>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {user?.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {user?.role === 'organizer' ? 'Organizer' : 'Player'}
                    </span>
                  </div>
                  {user?.role === 'player' && (
                    <div className="mt-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Your User ID (for receiving transfers)</p>
                          <p className="font-mono text-sm font-semibold text-primary">{user?.id}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCopyUserId}
                          className="shrink-0"
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Player Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="font-display text-xl font-semibold mb-4">Career Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard
              title="Tournaments Played"
              value={user?.stats.tournamentsPlayed || 0}
              icon={Trophy}
              variant="primary"
              index={0}
            />
            <StatsCard
              title="Tournaments Won"
              value={user?.stats.tournamentsWon || 0}
              icon={Award}
              variant="accent"
              index={1}
            />
            <StatsCard
              title="Total Earnings"
              value={`₹${((user?.stats.totalEarnings || 0) / 1000).toFixed(0)}K`}
              icon={Wallet}
              variant="secondary"
              index={2}
            />
            <StatsCard
              title="Current Rank"
              value={user?.stats.rank || 'N/A'}
              icon={Target}
              index={3}
            />
          </div>
        </motion.div>

        {/* Performance Stats */}
        {user?.role === 'player' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="font-display text-xl font-semibold mb-4">Performance Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-card border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-destructive" />
                  <span className="text-sm text-muted-foreground">Total Kills</span>
                </div>
                <p className="font-display text-2xl font-bold">{performanceStats.totalKills}</p>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Gamepad2 className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Avg Kills/Match</span>
                </div>
                <p className="font-display text-2xl font-bold">{performanceStats.avgKillsPerMatch}</p>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-5 w-5 text-accent" />
                  <span className="text-sm text-muted-foreground">Win Rate</span>
                </div>
                <p className="font-display text-2xl font-bold">{performanceStats.winRate}</p>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-secondary" />
                  <span className="text-sm text-muted-foreground">Top 10 Rate</span>
                </div>
                <p className="font-display text-2xl font-bold">{performanceStats.topTenRate}</p>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-neon-orange" />
                  <span className="text-sm text-muted-foreground">Avg Damage</span>
                </div>
                <p className="font-display text-2xl font-bold">{performanceStats.avgDamage}</p>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Gamepad2 className="h-5 w-5 text-neon-purple" />
                  <span className="text-sm text-muted-foreground">Avg Survival</span>
                </div>
                <p className="font-display text-2xl font-bold">{performanceStats.avgSurvivalTime}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recent Registrations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-display text-xl font-semibold mb-4">Tournament History</h2>
          <div className="rounded-lg bg-card border border-border/50 overflow-hidden">
            {registrations.length > 0 ? (
              <div className="divide-y divide-border/50">
                {registrations.map((reg) => (
                  <div key={reg.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{reg.teamName}</p>
                      <p className="text-sm text-muted-foreground">
                        Registered {new Date(reg.registeredAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      reg.status === 'confirmed' ? 'bg-accent/20 text-accent' :
                      reg.status === 'pending' ? 'bg-primary/20 text-primary' :
                      'bg-destructive/20 text-destructive'
                    }`}>
                      {reg.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <Trophy className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>No tournament history yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
