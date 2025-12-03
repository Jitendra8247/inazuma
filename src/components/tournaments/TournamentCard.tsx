// TournamentCard component - Card displaying tournament info

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, Trophy, MapPin, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tournament } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface TournamentCardProps {
  tournament: Tournament;
  featured?: boolean;
}

export default function TournamentCard({ tournament, featured = false }: TournamentCardProps) {
  const statusColors = {
    upcoming: 'bg-accent/20 text-accent border-accent/50',
    ongoing: 'bg-primary/20 text-primary border-primary/50',
    completed: 'bg-muted text-muted-foreground border-border'
  };

  const formatPrize = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 1)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const spotsLeft = tournament.maxTeams - tournament.registeredTeams;
  const isFull = spotsLeft <= 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn(
        "group relative rounded-lg bg-card border overflow-hidden transition-all duration-300",
        featured 
          ? "border-primary/50 hover:border-primary hover:shadow-neon" 
          : "border-border/50 hover:border-primary/50"
      )}
    >
      {/* Featured badge */}
      {featured && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-primary text-primary-foreground">Featured</Badge>
        </div>
      )}

      {/* Image placeholder with gradient overlay */}
      <div className="relative h-40 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        <div className="absolute bottom-4 left-4">
          <Badge variant="outline" className={statusColors[tournament.status]}>
            {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Title & Game */}
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Gamepad2 className="h-3 w-3" />
            <span>{tournament.game} • {tournament.mode}</span>
          </div>
          <h3 className="font-display text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
            {tournament.name}
          </h3>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Trophy className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">{formatPrize(tournament.prizePool)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4 text-secondary" />
            <span>{tournament.registeredTeams}/{tournament.maxTeams}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{new Date(tournament.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{tournament.region}</span>
          </div>
        </div>

        {/* Registration Status */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="text-sm">
            {isFull ? (
              <span className="text-destructive">Registration Full</span>
            ) : (
              <span className="text-accent">{spotsLeft} spots left</span>
            )}
          </div>
          <span className="text-sm text-muted-foreground">
            {tournament.entryFee === 0 ? 'Free Entry' : `₹${tournament.entryFee} Entry`}
          </span>
        </div>

        {/* Action Button */}
        <Button 
          variant={tournament.status === 'upcoming' ? 'neon' : 'outline'} 
          className="w-full"
          asChild
          disabled={tournament.status === 'completed'}
        >
          <Link to={`/tournaments/${tournament.id}`}>
            {tournament.status === 'completed' ? 'View Results' : 'View Details'}
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
