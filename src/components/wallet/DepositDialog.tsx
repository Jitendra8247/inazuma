// Deposit Dialog - Deposit money from bank

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWallet } from '@/context/WalletContext';
import { useToast } from '@/hooks/use-toast';
import { BankDetails } from '@/types/wallet';

interface DepositDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function DepositDialog({ open, onClose }: DepositDialogProps) {
  const { deposit, isLoading } = useWallet();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    bankName: ''
  });

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

    const result = await deposit(amountNum, bankDetails);

    if (result.success) {
      toast({
        title: 'Deposit Successful',
        description: `₹${amountNum.toLocaleString('en-IN')} has been added to your wallet`
      });
      setAmount('');
      setBankDetails({
        accountNumber: '',
        ifscCode: '',
        accountHolderName: '',
        bankName: ''
      });
      onClose();
    } else {
      toast({
        title: 'Deposit Failed',
        description: result.error,
        variant: 'destructive'
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Deposit Money</DialogTitle>
        </DialogHeader>

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
            <Label htmlFor="accountHolderName">Account Holder Name</Label>
            <Input
              id="accountHolderName"
              placeholder="John Doe"
              value={bankDetails.accountHolderName}
              onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              placeholder="1234567890"
              value={bankDetails.accountNumber}
              onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ifscCode">IFSC Code</Label>
            <Input
              id="ifscCode"
              placeholder="SBIN0001234"
              value={bankDetails.ifscCode}
              onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              placeholder="State Bank of India"
              value={bankDetails.bankName}
              onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="neon" disabled={isLoading} className="flex-1">
              {isLoading ? 'Processing...' : 'Deposit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
