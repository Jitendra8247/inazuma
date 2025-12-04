// Wallet Routes
import express from 'express';
import {
  getWallet,
  deposit,
  withdraw,
  transfer,
  getAllWallets,
  adminAddFunds,
  adminDeductFunds
} from '../controllers/walletController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getWallet);
router.post('/deposit', protect, deposit);
router.post('/withdraw', protect, withdraw);
router.post('/transfer', protect, transfer);

// Admin routes
router.get('/all', protect, restrictTo('organizer'), getAllWallets);
router.post('/admin/add', protect, restrictTo('organizer'), adminAddFunds);
router.post('/admin/deduct', protect, restrictTo('organizer'), adminDeductFunds);

export default router;
