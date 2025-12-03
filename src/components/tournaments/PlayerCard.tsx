// PlayerCard component - Displays player info in tournament context

import { motion } from 'framer-motion';
import { Trophy, Target, Gamepad2 } from 'lucide-react';
import { Player } from '@/data/mockData';

interface PlayerCardProps {
  player: Player;
  index?: number;
}

export default function PlayerCard({ player, index = 0 }: PlayerCardProps) {
  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Conqueror':
        return 'text-neon-orange';
      case 'Ace':
        return 'text-neon-magenta';
      case 'Crown':
        return 'text-neon-cyan';
      default:
        return 'text-muted-foreground';
    }
  };

  const winRate = ((player.wins / player.matches) * 100).toFixed(1);
  const kd = (player.kills / (player.matches - player.wins)).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-4 p-4 rounded-lg bg-card/50 border border-border/50 hover:border-primary/30 transition-colors"
    >
      {/* Avatar */}
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          <span className="font-display text-lg font-bold text-primary">
            {player.username.charAt(0)}
          </span>
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center">
          <span className="text-[10px] font-bold text-muted-foreground">#{index + 1}</span>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-display font-semibold truncate">{player.username}</h4>
          <span className={`text-xs font-medium ${getRankColor(player.rank)}`}>
            {player.rank}
          </span>
        </div>
        {player.team && (
          <p className="text-sm text-muted-foreground truncate">{player.team}</p>
        )}
      </div>

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Target className="h-4 w-4 text-destructive" />
          <span>{player.kills}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Trophy className="h-4 w-4 text-accent" />
          <span>{player.wins}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Gamepad2 className="h-4 w-4 text-primary" />
          <span>{player.matches}</span>
        </div>
      </div>
    </motion.div>
  );
}
