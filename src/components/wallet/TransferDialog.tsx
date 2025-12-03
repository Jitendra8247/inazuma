// Transfer Dialog - Transfer money to another user

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWallet } from '@/context/WalletContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface TransferDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function TransferDialog({ open, onClose }: TransferDialogProps) {
  const { transfer, wallet, isLoading } = useWallet();
  const { getUserById } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [autoFetchedName, setAutoFetchedName] = useState('');

  // Auto-fetch username when user ID is entered
  useEffect(() => {
    if (recipientId.trim()) {
      const user = getUserById(recipientId);
      if (user) {
        setAutoFetchedName(user.username);
      } else {
        setAutoFetchedName('');
      }
    } else {
      setAutoFetchedName('');
    }
  }, [recipientId, getUserById]);

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

    if (wallet && amountNum > wallet.balance) {
      toast({
        title: 'Insufficient Balance',
        description: `You only have ₹${wallet.balance.toLocaleString('en-IN')} in your wallet`,
        variant: 'destructive'
      });
      return;
    }

    if (!recipientId) {
      toast({
        title: 'Invalid Recipient',
        description: 'Please enter recipient User ID',
        variant: 'destructive'
      });
      return;
    }

    // Use auto-fetched name if available, otherwise use manually entered name
    const finalRecipientName = autoFetchedName || recipientName || 'Unknown User';

    if (!autoFetchedName) {
      toast({
        title: 'User Not Found',
        description: 'The entered User ID does not exist',
        variant: 'destructive'
      });
      return;
    }

    const result = await transfer(recipientId, finalRecipientName, amountNum);

    if (result.success) {
      toast({
        title: 'Transfer Successful',
        description: `₹${amountNum.toLocaleString('en-IN')} sent to ${finalRecipientName}`
      });
      setAmount('');
      setRecipientId('');
      setRecipientName('');
      setAutoFetchedName('');
      onClose();
    } else {
      toast({
        title: 'Transfer Failed',
        description: result.error,
        variant: 'destructive'
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Transfer Money</DialogTitle>
        </DialogHeader>

        <div className="mb-4 p-3 rounded-lg bg-muted">
          <p className="text-sm text-muted-foreground">Available Balance</p>
          <p className="font-display text-xl font-bold text-primary">
            ₹{wallet?.balance.toLocaleString('en-IN') || 0}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipientId">Recipient User ID</Label>
            <Input
              id="recipientId"
              placeholder="Enter user ID"
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Ask the recipient for their User ID from their profile
            </p>
          </div>

          {autoFetchedName && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-sm text-green-500">
                ✓ User found: <span className="font-semibold">{autoFetchedName}</span>
              </p>
            </div>
          )}

          {recipientId && !autoFetchedName && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-500">
                ✗ User not found with this ID
              </p>
            </div>
          )}

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

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="neon" disabled={isLoading} className="flex-1">
              {isLoading ? 'Processing...' : 'Transfer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
