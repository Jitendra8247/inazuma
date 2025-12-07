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
import { useWallet } from '@/context/WalletContext';

// Player details schema
const playerSchema = z.object({
  inGameName: z.string()
    .min(3, 'In-game name must be at least 3 characters')
    .max(20, 'In-game name must be less than 20 characters'),
  bgmiId: z.string()
    .min(5, 'BGMI ID must be at least 5 characters')
    .max(20, 'BGMI ID must be less than 20 characters'),
});

// Solo mode validation schema
const soloRegistrationSchema = z.object({
  player: playerSchema,
  email: z.string().email('Invalid email address'),
  phone: z.string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian phone number'),
  agreeToRules: z.boolean().refine(val => val === true, 'You must agree to the tournament rules'),
});

// Duo mode validation schema
const duoRegistrationSchema = z.object({
  teamName: z.string()
    .min(3, 'Team name must be at least 3 characters')
    .max(30, 'Team name must be less than 30 characters')
    .regex(/^[a-zA-Z0-9\s_-]+$/, 'Team name can only contain letters, numbers, spaces, underscores, and hyphens'),
  player1: playerSchema,
  player2: playerSchema,
  email: z.string().email('Invalid email address'),
  phone: z.string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian phone number'),
  agreeToRules: z.boolean().refine(val => val === true, 'You must agree to the tournament rules'),
});

// Squad mode validation schema
const squadRegistrationSchema = z.object({
  teamName: z.string()
    .min(3, 'Team name must be at least 3 characters')
    .max(30, 'Team name must be less than 30 characters')
    .regex(/^[a-zA-Z0-9\s_-]+$/, 'Team name can only contain letters, numbers, spaces, underscores, and hyphens'),
  player1: playerSchema,
  player2: playerSchema,
  player3: playerSchema,
  player4: playerSchema,
  email: z.string().email('Invalid email address'),
  phone: z.string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian phone number'),
  agreeToRules: z.boolean().refine(val => val === true, 'You must agree to the tournament rules'),
});

type SoloRegistrationFormData = z.infer<typeof soloRegistrationSchema>;
type DuoRegistrationFormData = z.infer<typeof duoRegistrationSchema>;
type SquadRegistrationFormData = z.infer<typeof squadRegistrationSchema>;
type RegistrationFormData = SoloRegistrationFormData | DuoRegistrationFormData | SquadRegistrationFormData;

export default function Registration() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getTournamentById, registerForTournament, isPlayerRegistered } = useTournaments();
  const { user, isAuthenticated } = useAuth();
  const { wallet, refreshWallet } = useWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tournament = getTournamentById(id || '');

  // Select schema based on tournament mode
  const getSchema = () => {
    if (!tournament) return soloRegistrationSchema;
    switch (tournament.mode) {
      case 'Solo':
        return soloRegistrationSchema;
      case 'Duo':
        return duoRegistrationSchema;
      case 'Squad':
        return squadRegistrationSchema;
      default:
        return soloRegistrationSchema;
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(getSchema()),
    defaultValues: {
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
    
    // Check if tournament has entry fee and wallet balance
    if (tournament.entryFee > 0) {
      if (!wallet || wallet.balance < tournament.entryFee) {
        setIsSubmitting(false);
        toast({
          title: 'Insufficient Balance',
          description: `You need ₹${tournament.entryFee} in your wallet. Current balance: ₹${wallet?.balance || 0}`,
          variant: 'destructive'
        });
        return;
      }
    }

    // Build registration payload based on mode
    const registrationPayload: any = {
      tournamentId: tournament.id,
      mode: tournament.mode,
      email: data.email,
      phone: data.phone,
    };

    if (tournament.mode === 'Solo') {
      const soloData = data as SoloRegistrationFormData;
      registrationPayload.player = soloData.player;
    } else if (tournament.mode === 'Duo') {
      const duoData = data as DuoRegistrationFormData;
      registrationPayload.teamName = duoData.teamName;
      registrationPayload.player1 = duoData.player1;
      registrationPayload.player2 = duoData.player2;
    } else if (tournament.mode === 'Squad') {
      const squadData = data as SquadRegistrationFormData;
      registrationPayload.teamName = squadData.teamName;
      registrationPayload.player1 = squadData.player1;
      registrationPayload.player2 = squadData.player2;
      registrationPayload.player3 = squadData.player3;
      registrationPayload.player4 = squadData.player4;
    }

    // Register for tournament (backend handles wallet deduction automatically)
    const result = await registerForTournament(registrationPayload);

    setIsSubmitting(false);

    if (result.success) {
      // Refresh wallet to get updated balance
      await refreshWallet();
      
      toast({
        title: 'Registration Successful!',
        description: tournament.entryFee > 0 
          ? `₹${tournament.entryFee} deducted from your wallet. You are registered for ${tournament.name}`
          : `You have been registered for ${tournament.name}`,
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
            {/* Mode Badge */}
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-sm font-medium text-primary">
                Tournament Mode: <span className="font-bold">{tournament.mode}</span>
              </p>
            </div>

            {/* Solo Mode Form */}
            {tournament.mode === 'Solo' && (
              <>
                <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border/50">
                  <h3 className="font-semibold text-sm text-muted-foreground">Player Details</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="player.inGameName">In-Game Name *</Label>
                    <Input
                      id="player.inGameName"
                      placeholder="Your in-game name"
                      {...register('player.inGameName')}
                      className={errors.player?.inGameName ? 'border-destructive' : ''}
                    />
                    {errors.player?.inGameName && (
                      <p className="text-sm text-destructive">{errors.player.inGameName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="player.bgmiId">BGMI ID *</Label>
                    <Input
                      id="player.bgmiId"
                      placeholder="Your BGMI player ID"
                      {...register('player.bgmiId')}
                      className={errors.player?.bgmiId ? 'border-destructive' : ''}
                    />
                    {errors.player?.bgmiId && (
                      <p className="text-sm text-destructive">{errors.player.bgmiId.message}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Duo Mode Form */}
            {tournament.mode === 'Duo' && (
              <>
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

                <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border/50">
                  <h3 className="font-semibold text-sm text-muted-foreground">Player 1 Details</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="player1.inGameName">In-Game Name *</Label>
                    <Input
                      id="player1.inGameName"
                      placeholder="Player 1 in-game name"
                      {...register('player1.inGameName')}
                      className={errors.player1?.inGameName ? 'border-destructive' : ''}
                    />
                    {errors.player1?.inGameName && (
                      <p className="text-sm text-destructive">{errors.player1.inGameName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="player1.bgmiId">BGMI ID *</Label>
                    <Input
                      id="player1.bgmiId"
                      placeholder="Player 1 BGMI ID"
                      {...register('player1.bgmiId')}
                      className={errors.player1?.bgmiId ? 'border-destructive' : ''}
                    />
                    {errors.player1?.bgmiId && (
                      <p className="text-sm text-destructive">{errors.player1.bgmiId.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border/50">
                  <h3 className="font-semibold text-sm text-muted-foreground">Player 2 Details</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="player2.inGameName">In-Game Name *</Label>
                    <Input
                      id="player2.inGameName"
                      placeholder="Player 2 in-game name"
                      {...register('player2.inGameName')}
                      className={errors.player2?.inGameName ? 'border-destructive' : ''}
                    />
                    {errors.player2?.inGameName && (
                      <p className="text-sm text-destructive">{errors.player2.inGameName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="player2.bgmiId">BGMI ID *</Label>
                    <Input
                      id="player2.bgmiId"
                      placeholder="Player 2 BGMI ID"
                      {...register('player2.bgmiId')}
                      className={errors.player2?.bgmiId ? 'border-destructive' : ''}
                    />
                    {errors.player2?.bgmiId && (
                      <p className="text-sm text-destructive">{errors.player2.bgmiId.message}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Squad Mode Form */}
            {tournament.mode === 'Squad' && (
              <>
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

                {[1, 2, 3, 4].map((playerNum) => (
                  <div key={playerNum} className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border/50">
                    <h3 className="font-semibold text-sm text-muted-foreground">Player {playerNum} Details</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`player${playerNum}.inGameName`}>In-Game Name *</Label>
                      <Input
                        id={`player${playerNum}.inGameName`}
                        placeholder={`Player ${playerNum} in-game name`}
                        {...register(`player${playerNum}.inGameName` as any)}
                        className={(errors as any)[`player${playerNum}`]?.inGameName ? 'border-destructive' : ''}
                      />
                      {(errors as any)[`player${playerNum}`]?.inGameName && (
                        <p className="text-sm text-destructive">{(errors as any)[`player${playerNum}`].inGameName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`player${playerNum}.bgmiId`}>BGMI ID *</Label>
                      <Input
                        id={`player${playerNum}.bgmiId`}
                        placeholder={`Player ${playerNum} BGMI ID`}
                        {...register(`player${playerNum}.bgmiId` as any)}
                        className={(errors as any)[`player${playerNum}`]?.bgmiId ? 'border-destructive' : ''}
                      />
                      {(errors as any)[`player${playerNum}`]?.bgmiId && (
                        <p className="text-sm text-destructive">{(errors as any)[`player${playerNum}`].bgmiId.message}</p>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Contact Information - Common for all modes */}
            <div className="space-y-4 pt-4 border-t border-border/50">
              <h3 className="font-semibold text-sm text-muted-foreground">Contact Information</h3>
              
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
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Entry Fee:</strong>{' '}
                  {tournament.entryFee === 0 ? 'Free Entry' : `₹${tournament.entryFee}`}
                </p>
                {tournament.entryFee > 0 && (
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Your Wallet Balance:</strong>{' '}
                    ₹{wallet?.balance || 0}
                  </p>
                )}
                {tournament.entryFee > 0 && wallet && wallet.balance < tournament.entryFee && (
                  <p className="text-sm text-destructive font-medium">
                    ⚠ Insufficient balance. Please add funds to your wallet.
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="neon"
              size="lg"
              className="w-full"
              disabled={isSubmitting || (tournament.entryFee > 0 && (!wallet || wallet.balance < tournament.entryFee))}
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <Trophy className="h-4 w-4 mr-2" />
                  {tournament.entryFee > 0 ? `Pay ₹${tournament.entryFee} & Register` : 'Complete Registration'}
                </>
              )}
            </Button>
            
            {tournament.entryFee > 0 && wallet && wallet.balance < tournament.entryFee && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => navigate('/wallet')}
              >
                Add Funds to Wallet
              </Button>
            )}
          </form>
        </motion.div>
      </div>
    </main>
  );
}
