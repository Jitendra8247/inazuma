# Wallet System Documentation

## Overview
The Inazuma Battle platform now includes a comprehensive wallet system that allows players to manage their funds and organizers to oversee all transactions.

## Features

### For Players

#### 1. Deposit Money
- Players can deposit money from their bank account
- Required information:
  - Amount
  - Account holder name
  - Account number
  - IFSC code
  - Bank name
- Funds are instantly added to the wallet

#### 2. Withdraw Money
- Players can withdraw funds to their bank account
- Same bank details required as deposit
- Withdrawal is processed instantly (in demo mode)
- Cannot withdraw more than available balance

#### 3. Transfer Money
- Send money to other players within the app
- Required information:
  - Recipient's User ID (visible on their profile)
  - Recipient's username
  - Amount to transfer
- Both sender and receiver get transaction records

#### 4. Tournament Registration
- Registration fees are automatically deducted from wallet
- Fees are transferred directly to the organizer's wallet
- Transaction history shows tournament name and details

#### 5. Transaction History
- View all transactions with details
- Transaction types:
  - Deposits (green, +)
  - Withdrawals (red, -)
  - Transfers sent (red, -)
  - Transfers received (green, +)
  - Tournament fees (red, -)
  - Tournament prizes (yellow, +)
  - Admin deductions (red, -)
  - Admin additions (green, +)

### For Organizers/Admin

#### 1. View All Wallets
- Access `/admin/wallets` to see all user wallets
- View statistics:
  - Total number of wallets
  - Total balance across all wallets
  - Your own balance
- Search functionality to find specific users

#### 2. Add Funds to User Wallet
- Add money to any player's wallet
- Requires a reason (e.g., "Compensation for technical issue")
- Transaction is recorded in user's history

#### 3. Deduct Funds from User Wallet
- Remove money from any player's wallet
- Requires a reason (e.g., "Penalty for cheating")
- Cannot deduct more than user's available balance
- Transaction is recorded in user's history

#### 4. Automatic Fee Collection
- When players register for tournaments, fees automatically transfer to organizer's wallet
- Both player and organizer get transaction records

#### 5. Prize Distribution
- Organizers can add prize money to winners' wallets
- Prize transactions are clearly marked in history

## Navigation

### Players
- Access wallet from navbar: "Wallet" button
- Or navigate to `/wallet`

### Organizers
- Access wallet management from navbar: "Wallets" button
- Or navigate to `/admin/wallets`
- Also have access to their own wallet at `/wallet`

## User ID
- Every user has a unique User ID
- Visible on the profile page
- Required for peer-to-peer transfers
- Share your User ID with others to receive money

## Technical Implementation

### Files Created
1. `src/types/wallet.ts` - Type definitions
2. `src/context/WalletContext.tsx` - Wallet state management
3. `src/pages/Wallet.tsx` - Player wallet page
4. `src/pages/AdminWallets.tsx` - Admin wallet management page
5. `src/components/wallet/DepositDialog.tsx` - Deposit dialog
6. `src/components/wallet/WithdrawDialog.tsx` - Withdraw dialog
7. `src/components/wallet/TransferDialog.tsx` - Transfer dialog
8. `src/components/wallet/TransactionHistory.tsx` - Transaction list
9. `src/components/wallet/AdminWalletDialog.tsx` - Admin fund management

### Context Provider
The `WalletProvider` wraps the app and provides:
- Wallet state for current user
- All wallets (for admin)
- Transaction functions
- Loading states

### Routes Added
- `/wallet` - Player wallet (protected, requires authentication)
- `/admin/wallets` - Admin wallet management (protected, requires organizer role)

## Security Notes
- All wallet operations require authentication
- Admin functions only available to users with 'organizer' role
- Cannot transfer to yourself
- Cannot withdraw/deduct more than available balance
- All transactions are logged with timestamps

## Future Enhancements
- Real payment gateway integration
- KYC verification
- Transaction limits
- Withdrawal approval workflow
- Email notifications for transactions
- Export transaction history
- Refund functionality
