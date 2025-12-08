// RegisteredTeamsList - Shows all teams registered for a tournament

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ChevronDown, ChevronUp, Gamepad2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { registrationsAPI } from '@/services/api';

interface PlayerData {
  inGameName: string;
  bgmiId: string;
}

interface Registration {
  id: string;
  tournamentId: string;
  playerId: string;
  playerName: string;
  teamName: string;
  mode: string;
  email?: string;
  phone?: string;
  player?: PlayerData;  // Solo mode
  player1?: PlayerData; // Duo/Squad
  player2?: PlayerData; // Duo/Squad
  player3?: PlayerData; // Squad
  player4?: PlayerData; // Squad
  registeredAt: string;
  status: string;
}

interface RegisteredTeamsListProps {
  tournamentId: string;
}

export default function RegisteredTeamsList({ tournamentId }: RegisteredTeamsListProps) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await registrationsAPI.getTournamentRegistrations(tournamentId);
        if (response.success && response.registrations) {
          setRegistrations(response.registrations);
        }
      } catch (error) {
        console.error('Error fetching registrations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegistrations();
  }, [tournamentId]);

  // Each registration contains all players for that team
  const teams = registrations;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Users className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="font-display text-xl font-semibold mb-2">No Teams Registered Yet</h3>
        <p className="text-muted-foreground">
          Be the first to register for this tournament!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {teams.length} team{teams.length !== 1 ? 's' : ''} registered
        </p>
      </div>

      {teams.map((registration, index) => {
        const isExpanded = expandedTeam === registration.id;
        
        // Get all players from the registration
        const players: PlayerData[] = [];
        if (registration.player) {
          players.push(registration.player); // Solo
        }
        if (registration.player1) players.push(registration.player1);
        if (registration.player2) players.push(registration.player2);
        if (registration.player3) players.push(registration.player3);
        if (registration.player4) players.push(registration.player4);
        
        return (
          <motion.div
            key={registration.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card 
              className="overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => setExpandedTeam(isExpanded ? null : registration.id)}
            >
              {/* Team Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold">{registration.teamName || registration.playerName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {players.length} player{players.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded bg-accent/20 text-accent">
                    {registration.status}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Team Members (Expandable) */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-border/50"
                  >
                    <div className="p-4 space-y-3 bg-muted/20">
                      {players.map((player, idx) => (
                        <div 
                          key={idx}
                          className="p-3 rounded-lg bg-card border border-border/50"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Gamepad2 className="h-4 w-4 text-primary" />
                              <span className="font-medium">{player.inGameName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="text-xs px-2 py-1 rounded bg-muted">BGMI ID</span>
                              <span>{player.bgmiId}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <div className="text-xs text-muted-foreground pt-2 border-t border-border/50">
                        Registered: {new Date(registration.registeredAt).toLocaleString()}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
