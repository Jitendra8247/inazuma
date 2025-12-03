// NotificationBanner component - Dismissible notification/alert banner

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationBannerProps {
  type?: 'info' | 'warning' | 'success' | 'error';
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function NotificationBanner({
  type = 'info',
  message,
  dismissible = true,
  onDismiss,
  action
}: NotificationBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const typeStyles = {
    info: 'bg-primary/10 border-primary/30 text-primary',
    warning: 'bg-neon-orange/10 border-neon-orange/30 text-neon-orange',
    success: 'bg-accent/10 border-accent/30 text-accent',
    error: 'bg-destructive/10 border-destructive/30 text-destructive'
  };

  const icons = {
    info: Info,
    warning: AlertTriangle,
    success: CheckCircle,
    error: AlertCircle
  };

  const Icon = icons[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg border",
            typeStyles[type]
          )}
        >
          <Icon className="h-5 w-5 flex-shrink-0" />
          <p className="flex-1 text-sm">{message}</p>
          
          {action && (
            <button
              onClick={action.onClick}
              className="text-sm font-medium underline-offset-4 hover:underline"
            >
              {action.label}
            </button>
          )}
          
          {dismissible && (
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-background/20 rounded transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
