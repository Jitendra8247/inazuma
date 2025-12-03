// My Tournaments Page - View tournaments the player has registered for

import { motion } from 'framer-motion';
import { Trophy, Calendar, Users, MapPin, IndianRupee, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useTournaments } from '@/context/TournamentContext';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function MyTournaments() {
  const { user } = useAuth();
  const { getRegistrationsByPlayer, getTournamentById } = useTournaments();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Please login to view your tournaments</p>
      </div>
    );
  }

  let registrations;
  let myTournaments;
  
  try {
    registrations = getRegistrationsByPlayer(user.id);
    myTournaments = registrations
      .map(reg => ({
        registration: reg,
        tournament: getTournamentById(reg.tournamentId)
      }))
      .filter(item => item.tournament !== null && item.tournament !== undefined);
  } catch (error) {
    console.error('Error loading tournaments:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-2">Error loading tournaments</p>
          <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      upcoming: { label: 'Upcoming', color: 'bg-blue-500/20 text-blue-500 border-blue-500/30' },
      ongoing: { label: 'Live', color: 'bg-accent/20 text-accent border-accent/30' },
      completed: { label: 'Completed', color: 'bg-muted text-muted-foreground border-border' },
      cancelled: { label: 'Cancelled', color: 'bg-destructive/20 text-destructive border-destructive/30' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.upcoming;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.label}
      </span>
    );
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
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">My Tournaments</h1>
          <p className="text-muted-foreground">View all tournaments you've registered for</p>
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
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Registered</p>
                <p className="font-display text-2xl font-bold">{myTournaments.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="font-display text-2xl font-bold">
                  {myTournaments.filter(t => t.tournament?.status === 'upcoming').length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="font-display text-2xl font-bold">
                  {myTournaments.filter(t => t.tournament?.status === 'completed').length}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Tournaments List */}
        {myTournaments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-12 text-center">
              <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold mb-2">No Tournaments Yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't registered for any tournaments yet. Start competing now!
              </p>
              <Button variant="neon" asChild>
                <Link to="/tournaments">Browse Tournaments</Link>
              </Button>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {myTournaments.map((item, index) => {
              const { tournament, registration } = item;
              if (!tournament) return null;

              return (
                <motion.div
                  key={registration.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 hover:border-primary/50 transition-colors">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Tournament Image */}
                      <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden bg-muted shrink-0">
                        <img
                          src={tournament.image || '/placeholder.svg'}
                          alt={tournament.name || 'Tournament'}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Tournament Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <h3 className="font-display text-xl font-bold mb-1">{tournament.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Team: <span className="font-semibold text-foreground">{registration.teamName}</span>
                            </p>
                          </div>
                          {getStatusBadge(tournament.status)}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {tournament.startDate 
                                ? format(new Date(tournament.startDate), 'MMM dd, yyyy')
                                : 'TBA'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{tournament.mode || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{tournament.registeredTeams || 0}/{tournament.maxTeams || 0} Teams</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <IndianRupee className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold text-primary">
                              {tournament.entryFee === 0 ? 'Free' : `₹${tournament.entryFee}`}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/tournaments/${tournament.id}`}>
                              View Details
                            </Link>
                          </Button>
                          <p className="text-xs text-muted-foreground">
                            Registered on {registration.registeredAt 
                              ? format(new Date(registration.registeredAt), 'MMM dd, yyyy')
                              : 'Unknown'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
