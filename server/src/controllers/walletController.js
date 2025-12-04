// Wallet Controller
import Wallet from '../models/Wallet.js';
import User from '../models/User.js';

// @desc    Get user wallet
// @route   GET /api/wallet
// @access  Private
export const getWallet = async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ userId: req.user._id });

    if (!wallet) {
      wallet = await Wallet.create({
        userId: req.user._id,
        balance: 0,
        transactions: []
      });
    }

    res.status(200).json({
      success: true,
      data: wallet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Deposit money
// @route   POST /api/wallet/deposit
// @access  Private
export const deposit = async (req, res) => {
  try {
    const { amount, bankDetails } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    let wallet = await Wallet.findOne({ userId: req.user._id });

    if (!wallet) {
      wallet = await Wallet.create({
        userId: req.user._id,
        balance: 0,
        transactions: []
      });
    }

    wallet.balance += amount;
    wallet.transactions.unshift({
      type: 'deposit',
      amount,
      balance: wallet.balance,
      description: `Deposited from ${bankDetails.bankName} (${bankDetails.accountNumber.slice(-4)})`,
      bankDetails
    });

    await wallet.save();

    res.status(200).json({
      success: true,
      data: wallet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Withdraw money
// @route   POST /api/wallet/withdraw
// @access  Private
export const withdraw = async (req, res) => {
  try {
    const { amount, bankDetails } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    const wallet = await Wallet.findOne({ userId: req.user._id });

    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    wallet.balance -= amount;
    wallet.transactions.unshift({
      type: 'withdraw',
      amount,
      balance: wallet.balance,
      description: `Withdrawn to ${bankDetails.bankName} (${bankDetails.accountNumber.slice(-4)})`,
      bankDetails
    });

    await wallet.save();

    res.status(200).json({
      success: true,
      data: wallet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Transfer money
// @route   POST /api/wallet/transfer
// @access  Private
export const transfer = async (req, res) => {
  try {
    const { toUserId, amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    if (toUserId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot transfer to yourself'
      });
    }

    const senderWallet = await Wallet.findOne({ userId: req.user._id });

    if (!senderWallet || senderWallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    const recipient = await User.findById(toUserId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }

    let recipientWallet = await Wallet.findOne({ userId: toUserId });
    if (!recipientWallet) {
      recipientWallet = await Wallet.create({
        userId: toUserId,
        balance: 0,
        transactions: []
      });
    }

    // Deduct from sender
    senderWallet.balance -= amount;
    senderWallet.transactions.unshift({
      type: 'transfer_sent',
      amount,
      balance: senderWallet.balance,
      description: `Transferred to ${recipient.username}`,
      relatedUserId: toUserId,
      relatedUserName: recipient.username
    });
    await senderWallet.save();

    // Add to recipient
    recipientWallet.balance += amount;
    recipientWallet.transactions.unshift({
      type: 'transfer_received',
      amount,
      balance: recipientWallet.balance,
      description: `Received from ${req.user.username}`,
      relatedUserId: req.user._id,
      relatedUserName: req.user.username
    });
    await recipientWallet.save();

    res.status(200).json({
      success: true,
      data: senderWallet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all wallets (Admin only)
// @route   GET /api/wallet/all
// @access  Private (Organizer only)
export const getAllWallets = async (req, res) => {
  try {
    const wallets = await Wallet.find().populate('userId', 'username email role');

    res.status(200).json({
      success: true,
      count: wallets.length,
      data: wallets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Admin add funds
// @route   POST /api/wallet/admin/add
// @access  Private (Organizer only)
export const adminAddFunds = async (req, res) => {
  try {
    const { userId, amount, reason } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = await Wallet.create({
        userId,
        balance: 0,
        transactions: []
      });
    }

    wallet.balance += amount;
    wallet.transactions.unshift({
      type: 'admin_addition',
      amount,
      balance: wallet.balance,
      description: `Admin addition: ${reason}`,
      relatedUserId: req.user._id,
      relatedUserName: req.user.username
    });

    await wallet.save();

    res.status(200).json({
      success: true,
      data: wallet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Admin deduct funds
// @route   POST /api/wallet/admin/deduct
// @access  Private (Organizer only)
export const adminDeductFunds = async (req, res) => {
  try {
    const { userId, amount, reason } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    const wallet = await Wallet.findOne({ userId });

    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    wallet.balance -= amount;
    wallet.transactions.unshift({
      type: 'admin_deduction',
      amount,
      balance: wallet.balance,
      description: `Admin deduction: ${reason}`,
      relatedUserId: req.user._id,
      relatedUserName: req.user.username
    });

    await wallet.save();

    res.status(200).json({
      success: true,
      data: wallet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
