// StatsCard component - Dashboard stat display card

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
  index?: number;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  change,
  changeType = 'neutral',
  variant = 'default',
  index = 0
}: StatsCardProps) {
  const variants = {
    default: 'border-border/50',
    primary: 'border-primary/30 bg-primary/5',
    secondary: 'border-secondary/30 bg-secondary/5',
    accent: 'border-accent/30 bg-accent/5'
  };

  const iconColors = {
    default: 'text-muted-foreground',
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent'
  };

  const changeColors = {
    positive: 'text-accent',
    negative: 'text-destructive',
    neutral: 'text-muted-foreground'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "p-6 rounded-lg bg-card border transition-all duration-300 hover:shadow-lg",
        variants[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="font-display text-2xl md:text-3xl font-bold">{value}</p>
          {change && (
            <p className={cn("text-sm mt-2", changeColors[changeType])}>
              {change}
            </p>
          )}
        </div>
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center",
          variant === 'default' ? 'bg-muted' : `bg-${variant}/10`
        )}>
          <Icon className={cn("h-6 w-6", iconColors[variant])} />
        </div>
      </div>
    </motion.div>
  );
}
