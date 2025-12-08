// Admin Player Stats - Organizers can update player statistics

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Edit2, Save, X, Trophy, Target, Wallet, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { usersAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  stats: {
    tournamentsPlayed: number;
    tournamentsWon: number;
    totalEarnings: number;
    totalFinishes: number;
  };
}

export default function AdminPlayerStats() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [players, setPlayers] = useState<User[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingPlayer, setEditingPlayer] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    tournamentsWon: 0,
    totalEarnings: 0,
    totalFinishes: 0,
  });

  // Fetch all players
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await usersAPI.getAllUsers();
        if (response.success && response.users) {
          const playerUsers = response.users
            .filter((u: any) => u.role === 'player')
            .map((u: any) => ({
              id: u._id || u.id,
              username: u.username,
              email: u.email,
              role: u.role,
              stats: {
                tournamentsPlayed: u.stats?.tournamentsPlayed || 0,
                tournamentsWon: u.stats?.tournamentsWon || 0,
                totalEarnings: u.stats?.totalEarnings || 0,
                totalFinishes: u.stats?.totalFinishes || 0,
              },
            }));
          setPlayers(playerUsers);
          setFilteredPlayers(playerUsers);
        }
      } catch (error) {
        console.error('Error fetching players:', error);
        toast({
          title: 'Error',
          description: 'Failed to load players',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === 'organizer') {
      fetchPlayers();
    }
  }, [user, toast]);

  // Filter players based on search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPlayers(players);
    } else {
      const filtered = players.filter(
        (player) =>
          player.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          player.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPlayers(filtered);
    }
  }, [searchQuery, players]);

  const handleEditClick = (player: User) => {
    setEditingPlayer(player);
    setFormData({
      tournamentsWon: player.stats.tournamentsWon || 0,
      totalEarnings: player.stats.totalEarnings || 0,
      totalFinishes: player.stats.totalFinishes || 0,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingPlayer) return;

    setIsSaving(true);

    try {
      console.log('💾 Saving stats for player:', editingPlayer.username);
      console.log('📝 Player ID:', editingPlayer.id);
      console.log('📊 New stats:', {
        tournamentsWon: formData.tournamentsWon,
        totalEarnings: formData.totalEarnings,
        totalFinishes: formData.totalFinishes,
      });

      const response = await usersAPI.updateUser(editingPlayer.id, {
        stats: {
          tournamentsWon: formData.tournamentsWon,
          totalEarnings: formData.totalEarnings,
          totalFinishes: formData.totalFinishes,
        },
      });

      console.log('✅ Update response:', response);

      if (response.success) {
        // Update local state
        setPlayers((prev) =>
          prev.map((p) =>
            p.id === editingPlayer.id
              ? {
                  ...p,
                  stats: {
                    ...p.stats,
                    tournamentsWon: formData.tournamentsWon,
                    totalEarnings: formData.totalEarnings,
                    totalFinishes: formData.totalFinishes,
                  },
                }
              : p
          )
        );

        toast({
          title: 'Stats Updated',
          description: `Successfully updated stats for ${editingPlayer.username}`,
        });

        setIsDialogOpen(false);
        setEditingPlayer(null);
      } else {
        console.error('❌ Update failed - response not successful');
        toast({
          title: 'Update Failed',
          description: 'Server returned unsuccessful response',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('❌ Error updating stats:', error);
      console.error('Error details:', error.response?.data);
      toast({
        title: 'Update Failed',
        description: error.response?.data?.message || 'Failed to update player stats',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const calculateAvgFinishes = (totalFinishes: number, tournamentsPlayed: number) => {
    if (tournamentsPlayed === 0) return '0.0';
    return (totalFinishes / tournamentsPlayed).toFixed(1);
  };

  if (user?.role !== 'organizer') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Access denied. Organizers only.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="font-display text-3xl md:text-4xl font-bold">Player Statistics</h1>
          </div>
          <p className="text-muted-foreground">
            Update player stats including tournaments won, earnings, and finishes
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search players by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Players List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredPlayers.length === 0 ? (
          <Card className="p-12 text-center">
            <Users className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold mb-2">No Players Found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? 'Try a different search query' : 'No players registered yet'}
            </p>
          </Card>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {filteredPlayers.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Player Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <span className="font-display text-xl font-bold text-primary">
                          {player.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-display font-semibold">{player.username}</h3>
                        <p className="text-sm text-muted-foreground">{player.email}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 flex-1">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Played</p>
                        <p className="font-semibold">{player.stats.tournamentsPlayed || 0}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Won</p>
                        <p className="font-semibold text-accent">{player.stats.tournamentsWon || 0}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Earnings</p>
                        <p className="font-semibold text-primary">
                          ₹{((player.stats.totalEarnings || 0) / 1000).toFixed(0)}K
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Finishes</p>
                        <p className="font-semibold">{player.stats.totalFinishes || 0}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Avg</p>
                        <p className="font-semibold">
                          {calculateAvgFinishes(
                            player.stats.totalFinishes || 0,
                            player.stats.tournamentsPlayed || 0
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Edit Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(player)}
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Stats
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">
                Edit Stats - {editingPlayer?.username}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">Tournaments Played (Auto)</p>
                <p className="font-semibold">{editingPlayer?.stats.tournamentsPlayed || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  This is automatically updated by the system
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tournamentsWon">
                  <Trophy className="h-4 w-4 inline mr-2" />
                  Tournaments Won
                </Label>
                <Input
                  id="tournamentsWon"
                  type="number"
                  min="0"
                  value={formData.tournamentsWon}
                  onChange={(e) =>
                    setFormData({ ...formData, tournamentsWon: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalEarnings">
                  <Wallet className="h-4 w-4 inline mr-2" />
                  Total Earnings (₹)
                </Label>
                <Input
                  id="totalEarnings"
                  type="number"
                  min="0"
                  value={formData.totalEarnings}
                  onChange={(e) =>
                    setFormData({ ...formData, totalEarnings: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalFinishes">
                  <Target className="h-4 w-4 inline mr-2" />
                  Total Finishes
                </Label>
                <Input
                  id="totalFinishes"
                  type="number"
                  min="0"
                  value={formData.totalFinishes}
                  onChange={(e) =>
                    setFormData({ ...formData, totalFinishes: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm font-medium mb-1">Calculated Stats:</p>
                <p className="text-sm text-muted-foreground">
                  Avg Finishes:{' '}
                  <span className="font-semibold text-foreground">
                    {calculateAvgFinishes(
                      formData.totalFinishes,
                      editingPlayer?.stats.tournamentsPlayed || 0
                    )}
                  </span>
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="neon"
                  className="flex-1"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSaving}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
