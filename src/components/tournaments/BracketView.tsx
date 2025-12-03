// BracketView component - Simple tournament bracket visualization

import { motion } from 'framer-motion';
import { BracketMatch } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface BracketViewProps {
  matches: BracketMatch[];
}

export default function BracketView({ matches }: BracketViewProps) {
  // Group matches by round
  const rounds = matches.reduce((acc, match) => {
    if (!acc[match.round]) {
      acc[match.round] = [];
    }
    acc[match.round].push(match);
    return acc;
  }, {} as Record<number, BracketMatch[]>);

  const roundNames = ['', 'Quarter Finals', 'Semi Finals', 'Finals'];

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-8 min-w-max">
        {Object.entries(rounds).map(([round, roundMatches]) => (
          <div key={round} className="flex flex-col gap-4">
            {/* Round Header */}
            <h4 className="font-display text-sm text-muted-foreground text-center mb-2">
              {roundNames[parseInt(round)] || `Round ${round}`}
            </h4>

            {/* Matches */}
            <div className="flex flex-col gap-4 justify-around flex-1">
              {roundMatches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="w-56"
                >
                  <div className="rounded-lg border border-border/50 overflow-hidden bg-card">
                    {/* Team 1 */}
                    <div
                      className={cn(
                        "flex items-center justify-between p-3 border-b border-border/50",
                        match.winner === match.team1 && "bg-accent/10"
                      )}
                    >
                      <span className={cn(
                        "text-sm truncate",
                        match.winner === match.team1 ? "text-accent font-semibold" : "text-foreground"
                      )}>
                        {match.team1}
                      </span>
                      {match.score1 !== undefined && (
                        <span className={cn(
                          "font-display font-bold",
                          match.winner === match.team1 ? "text-accent" : "text-muted-foreground"
                        )}>
                          {match.score1}
                        </span>
                      )}
                    </div>

                    {/* Team 2 */}
                    <div
                      className={cn(
                        "flex items-center justify-between p-3",
                        match.winner === match.team2 && "bg-accent/10"
                      )}
                    >
                      <span className={cn(
                        "text-sm truncate",
                        match.winner === match.team2 ? "text-accent font-semibold" : "text-foreground"
                      )}>
                        {match.team2}
                      </span>
                      {match.score2 !== undefined && (
                        <span className={cn(
                          "font-display font-bold",
                          match.winner === match.team2 ? "text-accent" : "text-muted-foreground"
                        )}>
                          {match.score2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Match Status */}
                  {!match.winner && (
                    <p className="text-xs text-center text-muted-foreground mt-2">
                      Upcoming
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
