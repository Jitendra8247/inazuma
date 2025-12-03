// Tournament Details Page - Full tournament information, rules, players, and bracket

import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, Users, Trophy, MapPin, Gamepad2, Clock, 
  ArrowLeft, CheckCircle, AlertCircle, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PlayerCard from '@/components/tournaments/PlayerCard';
import BracketView from '@/components/tournaments/BracketView';
import NotificationBanner from '@/components/common/NotificationBanner';
import { useTournaments } from '@/context/TournamentContext';
import { useAuth } from '@/context/AuthContext';
import { mockPlayers, mockBracket } from '@/data/mockData';

export default function TournamentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTournamentById, isPlayerRegistered } = useTournaments();
  const { user, isAuthenticated } = useAuth();

  const tournament = getTournamentById(id || '');

  if (!tournament) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold mb-2">Tournament Not Found</h1>
          <p className="text-muted-foreground mb-4">The tournament you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/tournaments')}>Back to Tournaments</Button>
        </div>
      </div>
    );
  }

  const statusColors = {
    upcoming: 'bg-accent/20 text-accent border-accent/50',
    ongoing: 'bg-primary/20 text-primary border-primary/50',
    completed: 'bg-muted text-muted-foreground border-border'
  };

  const formatPrize = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 1)} Lakh`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const spotsLeft = tournament.maxTeams - tournament.registeredTeams;
  const isRegistered = user ? isPlayerRegistered(tournament.id, user.id) : false;
  const canRegister = tournament.status === 'upcoming' && spotsLeft > 0 && !isRegistered;

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button variant="ghost" onClick={() => navigate('/tournaments')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tournaments
          </Button>
        </motion.div>

        {/* Registration Status Banner */}
        {isRegistered && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <NotificationBanner
              type="success"
              message="You are registered for this tournament!"
              dismissible={false}
            />
          </motion.div>
        )}

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Tournament Image/Banner */}
          <div className="relative h-48 md:h-64 rounded-lg overflow-hidden mb-6 bg-gradient-to-br from-primary/30 to-secondary/30">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <Badge variant="outline" className={statusColors[tournament.status]}>
                {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Title and Info */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Gamepad2 className="h-4 w-4" />
                <span>{tournament.game} • {tournament.mode}</span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
                {tournament.name}
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                {tournament.description}
              </p>
            </div>

            {/* Prize Pool & Registration */}
            <div className="lg:text-right space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Prize Pool</p>
                <p className="font-display text-3xl font-bold text-primary neon-text-cyan">
                  {formatPrize(tournament.prizePool)}
                </p>
              </div>
              {canRegister ? (
                <Button variant="neon" size="lg" asChild>
                  <Link to={`/register/${tournament.id}`}>
                    Register Now - {tournament.entryFee === 0 ? 'Free' : `₹${tournament.entryFee}`}
                  </Link>
                </Button>
              ) : isRegistered ? (
                <Button variant="outline" size="lg" disabled>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Registered
                </Button>
              ) : (
                <Button variant="outline" size="lg" disabled>
                  {tournament.status === 'completed' ? 'Tournament Ended' : 'Registration Full'}
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="p-4 rounded-lg bg-card border border-border/50">
            <Calendar className="h-5 w-5 text-primary mb-2" />
            <p className="text-xs text-muted-foreground">Start Date</p>
            <p className="font-semibold">{new Date(tournament.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border/50">
            <Users className="h-5 w-5 text-secondary mb-2" />
            <p className="text-xs text-muted-foreground">Teams</p>
            <p className="font-semibold">{tournament.registeredTeams}/{tournament.maxTeams}</p>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border/50">
            <MapPin className="h-5 w-5 text-accent mb-2" />
            <p className="text-xs text-muted-foreground">Region</p>
            <p className="font-semibold">{tournament.region}</p>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border/50">
            <Trophy className="h-5 w-5 text-neon-orange mb-2" />
            <p className="text-xs text-muted-foreground">Entry Fee</p>
            <p className="font-semibold">{tournament.entryFee === 0 ? 'Free' : `₹${tournament.entryFee}`}</p>
          </div>
        </motion.div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="rules" className="space-y-6">
            <TabsList className="bg-card border border-border/50">
              <TabsTrigger value="rules">Rules</TabsTrigger>
              <TabsTrigger value="players">Players</TabsTrigger>
              <TabsTrigger value="bracket">Bracket</TabsTrigger>
            </TabsList>

            <TabsContent value="rules" className="space-y-4">
              <div className="p-6 rounded-lg bg-card border border-border/50">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-lg font-semibold">Tournament Rules</h3>
                </div>
                <ul className="space-y-3">
                  {tournament.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-muted-foreground">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="players">
              <div className="space-y-3">
                {mockPlayers.map((player, index) => (
                  <PlayerCard key={player.id} player={player} index={index} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="bracket">
              <div className="p-6 rounded-lg bg-card border border-border/50">
                <h3 className="font-display text-lg font-semibold mb-6">Tournament Bracket</h3>
                <BracketView matches={mockBracket} />
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </main>
  );
}
