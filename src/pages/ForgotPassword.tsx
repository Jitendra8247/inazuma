// Forgot Password Page - Two Step Process
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, User, Lock, Eye, EyeOff, ArrowLeft, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { passwordResetAPI } from '@/services/api';

// Step 1: Verify user
const verifyUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
});

// Step 2: Reset password
const resetPasswordSchema = z.object({
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type VerifyUserFormData = z.infer<typeof verifyUserSchema>;
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ForgotPassword() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState<'verify' | 'reset'>('verify');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const verifyForm = useForm<VerifyUserFormData>({
    resolver: zodResolver(verifyUserSchema),
  });

  const resetForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onVerifySubmit = async (data: VerifyUserFormData) => {
    setIsSubmitting(true);

    try {
      const response = await passwordResetAPI.verifyUser(data.email, data.username);

      if (response.success) {
        setResetToken(response.resetToken);
        setUserEmail(response.email);
        setStep('reset');
        toast({
          title: 'User Verified',
          description: 'Now enter your new password',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Verification Failed',
        description: error.response?.data?.message || 'Email and username do not match',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onResetSubmit = async (data: ResetPasswordFormData) => {
    setIsSubmitting(true);

    try {
      const response = await passwordResetAPI.resetPassword(resetToken, data.password);

      if (response.success) {
        toast({
          title: 'Password Reset Successful',
          description: 'You can now login with your new password',
        });

        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error: any) {
      toast({
        title: 'Reset Failed',
        description: error.response?.data?.message || 'Failed to reset password',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4">
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Zap className="h-10 w-10 text-primary" />
            <span className="font-display text-2xl font-bold tracking-wider">INAZUMA</span>
          </Link>
          <h1 className="font-display text-2xl font-bold mb-2">Reset Password</h1>
          <p className="text-muted-foreground">
            {step === 'verify' 
              ? 'Enter your email and username to verify your account'
              : 'Enter your new password'
            }
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            step === 'verify' ? 'bg-primary text-primary-foreground' : 'bg-green-500 text-white'
          }`}>
            1
          </div>
          <div className={`w-16 h-1 ${step === 'reset' ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            step === 'reset' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            2
          </div>
        </div>

        <div className="p-6 rounded-lg bg-card border border-border/50">
          {/* Step 1: Verify User */}
          {step === 'verify' && (
            <form onSubmit={verifyForm.handleSubmit(onVerifySubmit)} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className={`pl-10 ${verifyForm.formState.errors.email ? 'border-destructive' : ''}`}
                    {...verifyForm.register('email')}
                  />
                </div>
                {verifyForm.formState.errors.email && (
                  <p className="text-sm text-destructive">{verifyForm.formState.errors.email.message}</p>
                )}
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Your username"
                    className={`pl-10 ${verifyForm.formState.errors.username ? 'border-destructive' : ''}`}
                    {...verifyForm.register('username')}
                  />
                </div>
                {verifyForm.formState.errors.username && (
                  <p className="text-sm text-destructive">{verifyForm.formState.errors.username.message}</p>
                )}
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
                    <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  'Verify Account'
                )}
              </Button>
            </form>
          )}

          {/* Step 2: Reset Password */}
          {step === 'reset' && (
            <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
              {/* User Info */}
              <div className="p-3 rounded-lg bg-muted/50 border border-border/50 mb-4">
                <p className="text-sm text-muted-foreground">Resetting password for:</p>
                <p className="font-semibold">{userEmail}</p>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    className={`pl-10 pr-10 ${resetForm.formState.errors.password ? 'border-destructive' : ''}`}
                    {...resetForm.register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {resetForm.formState.errors.password && (
                  <p className="text-sm text-destructive">{resetForm.formState.errors.password.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Must be at least 6 characters with uppercase, lowercase, and number
                </p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    className={`pl-10 pr-10 ${resetForm.formState.errors.confirmPassword ? 'border-destructive' : ''}`}
                    {...resetForm.register('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {resetForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive">{resetForm.formState.errors.confirmPassword.message}</p>
                )}
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
                    <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                    Resetting Password...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Reset Password
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
