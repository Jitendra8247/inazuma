// Admin Wallet Dialog - Add or deduct funds from user wallet

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useWallet } from '@/context/WalletContext';
import { useToast } from '@/hooks/use-toast';

interface AdminWalletDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  username: string;
  actionType: 'add' | 'deduct';
}

export default function AdminWalletDialog({
  open,
  onClose,
  userId,
  username,
  actionType
}: AdminWalletDialogProps) {
  const { adminAddFunds, adminDeductFunds, getUserWallet, wallet, isLoading } = useWallet();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');

  const userWallet = getUserWallet(userId);
  const adminBalance = wallet?.balance || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount',
        variant: 'destructive'
      });
      return;
    }

    if (!reason.trim()) {
      toast({
        title: 'Reason Required',
        description: 'Please provide a reason for this action',
        variant: 'destructive'
      });
      return;
    }

    // Check admin balance when adding funds
    if (actionType === 'add' && adminBalance < amountNum) {
      toast({
        title: 'Insufficient Balance',
        description: `You need ₹${amountNum.toLocaleString('en-IN')} but only have ₹${adminBalance.toLocaleString('en-IN')} in your wallet`,
        variant: 'destructive'
      });
      return;
    }

    // Check player balance when deducting funds
    if (actionType === 'deduct' && (userWallet?.balance || 0) < amountNum) {
      toast({
        title: 'Insufficient Balance',
        description: `Player only has ₹${(userWallet?.balance || 0).toLocaleString('en-IN')} in their wallet`,
        variant: 'destructive'
      });
      return;
    }

    const result = actionType === 'add'
      ? await adminAddFunds(userId, amountNum, reason)
      : await adminDeductFunds(userId, amountNum, reason);

    if (result.success) {
      toast({
        title: `Funds ${actionType === 'add' ? 'Added' : 'Deducted'}`,
        description: actionType === 'add' 
          ? `₹${amountNum.toLocaleString('en-IN')} transferred from your wallet to ${username}'s wallet`
          : `₹${amountNum.toLocaleString('en-IN')} transferred from ${username}'s wallet to your wallet`
      });
      setAmount('');
      setReason('');
      onClose();
    } else {
      toast({
        title: 'Action Failed',
        description: result.error,
        variant: 'destructive'
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {actionType === 'add' ? 'Add Funds' : 'Deduct Funds'} - {username}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mb-4">
          <div className="p-3 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground">Player's Current Balance</p>
            <p className="font-display text-xl font-bold text-primary">
              ₹{userWallet?.balance.toLocaleString('en-IN') || 0}
            </p>
          </div>

          {actionType === 'add' && (
            <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/30">
              <p className="text-sm text-muted-foreground">Your Wallet Balance</p>
              <p className="font-display text-lg font-bold text-secondary">
                ₹{adminBalance.toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Amount will be deducted from your wallet
              </p>
            </div>
          )}

          {actionType === 'deduct' && (
            <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
              <p className="text-sm text-muted-foreground">Your Wallet Balance</p>
              <p className="font-display text-lg font-bold text-accent">
                ₹{adminBalance.toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Amount will be added to your wallet
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              placeholder={actionType === 'add' ? 'e.g., Compensation for technical issue' : 'e.g., Penalty for cheating'}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              variant={actionType === 'add' ? 'neon' : 'destructive'}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Processing...' : actionType === 'add' ? 'Add Funds' : 'Deduct Funds'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
