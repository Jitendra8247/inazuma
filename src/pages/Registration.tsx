// Registration Page - Tournament registration form with validation

import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Trophy, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useTournaments } from '@/context/TournamentContext';
import { useAuth } from '@/context/AuthContext';

// Validation schema
const registrationSchema = z.object({
  teamName: z.string()
    .min(3, 'Team name must be at least 3 characters')
    .max(30, 'Team name must be less than 30 characters')
    .regex(/^[a-zA-Z0-9\s_-]+$/, 'Team name can only contain letters, numbers, spaces, underscores, and hyphens'),
  playerName: z.string()
    .min(3, 'Player name must be at least 3 characters')
    .max(20, 'Player name must be less than 20 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian phone number'),
  inGameId: z.string()
    .min(5, 'In-game ID must be at least 5 characters')
    .max(20, 'In-game ID must be less than 20 characters'),
  agreeToRules: z.boolean().refine(val => val === true, 'You must agree to the tournament rules'),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function Registration() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getTournamentById, registerForTournament, isPlayerRegistered } = useTournaments();
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tournament = getTournamentById(id || '');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      playerName: user?.username || '',
      email: user?.email || '',
      agreeToRules: false
    }
  });

  // Check if user can register
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold mb-2">Login Required</h1>
          <p className="text-muted-foreground mb-4">You need to be logged in to register for tournaments.</p>
          <Button variant="neon" asChild>
            <Link to="/login">Login to Continue</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isRegistered = isPlayerRegistered(tournament.id, user?.id || '');
  
  if (isRegistered) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-accent mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold mb-2">Already Registered!</h1>
          <p className="text-muted-foreground mb-4">You are already registered for this tournament.</p>
          <Button asChild>
            <Link to={`/tournaments/${tournament.id}`}>View Tournament</Link>
          </Button>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    
    const result = await registerForTournament({
      tournamentId: tournament.id,
      playerId: user?.id || '',
      playerName: data.playerName,
      teamName: data.teamName
    });

    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: 'Registration Successful!',
        description: `You have been registered for ${tournament.name}`,
      });
      navigate(`/tournaments/${tournament.id}`);
    } else {
      toast({
        title: 'Registration Failed',
        description: result.error || 'Something went wrong',
        variant: 'destructive'
      });
    }
  };

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button variant="ghost" onClick={() => navigate(`/tournaments/${tournament.id}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tournament
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">Register for Tournament</h1>
          <p className="text-muted-foreground">{tournament.name}</p>
        </motion.div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-lg bg-card border border-border/50"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Team Name */}
            <div className="space-y-2">
              <Label htmlFor="teamName">Team Name *</Label>
              <Input
                id="teamName"
                placeholder="Enter your team name"
                {...register('teamName')}
                className={errors.teamName ? 'border-destructive' : ''}
              />
              {errors.teamName && (
                <p className="text-sm text-destructive">{errors.teamName.message}</p>
              )}
            </div>

            {/* Player Name */}
            <div className="space-y-2">
              <Label htmlFor="playerName">Player Name *</Label>
              <Input
                id="playerName"
                placeholder="Enter your player name"
                {...register('playerName')}
                className={errors.playerName ? 'border-destructive' : ''}
              />
              {errors.playerName && (
                <p className="text-sm text-destructive">{errors.playerName.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                {...register('email')}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="10-digit mobile number"
                {...register('phone')}
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            {/* In-Game ID */}
            <div className="space-y-2">
              <Label htmlFor="inGameId">In-Game ID *</Label>
              <Input
                id="inGameId"
                placeholder="Your BGMI player ID"
                {...register('inGameId')}
                className={errors.inGameId ? 'border-destructive' : ''}
              />
              {errors.inGameId && (
                <p className="text-sm text-destructive">{errors.inGameId.message}</p>
              )}
            </div>

            {/* Rules Agreement */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="agreeToRules"
                {...register('agreeToRules')}
                className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <div>
                <Label htmlFor="agreeToRules" className="cursor-pointer">
                  I agree to the tournament rules and terms *
                </Label>
                {errors.agreeToRules && (
                  <p className="text-sm text-destructive">{errors.agreeToRules.message}</p>
                )}
              </div>
            </div>

            {/* Entry Fee Notice */}
            <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Entry Fee:</strong>{' '}
                {tournament.entryFee === 0 ? 'Free Entry' : `₹${tournament.entryFee}`}
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="neon"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <Trophy className="h-4 w-4 mr-2" />
                  Complete Registration
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
