// Registration Controller
import Registration from '../models/Registration.js';
import Tournament from '../models/Tournament.js';
import Wallet from '../models/Wallet.js';

// @desc    Register for tournament
// @route   POST /api/registrations
// @access  Private (Player only)
export const registerForTournament = async (req, res) => {
  try {
    const { tournamentId, teamName, email, phone, inGameId } = req.body;

    // Check if tournament exists
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    // Check if tournament is full
    if (tournament.registeredTeams >= tournament.maxTeams) {
      return res.status(400).json({
        success: false,
        message: 'Tournament is full'
      });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      tournamentId,
      playerId: req.user._id
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'Already registered for this tournament'
      });
    }

    // Check wallet balance if entry fee exists
    if (tournament.entryFee > 0) {
      const wallet = await Wallet.findOne({ userId: req.user._id });
      
      if (!wallet || wallet.balance < tournament.entryFee) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient wallet balance'
        });
      }

      // Deduct fee from player wallet
      wallet.balance -= tournament.entryFee;
      wallet.transactions.unshift({
        type: 'tournament_fee',
        amount: tournament.entryFee,
        balance: wallet.balance,
        description: `Registration fee for ${tournament.name}`,
        tournamentId: tournament._id,
        tournamentName: tournament.name
      });
      await wallet.save();

      // Add fee to organizer wallet
      let organizerWallet = await Wallet.findOne({ userId: tournament.organizerId });
      if (!organizerWallet) {
        organizerWallet = await Wallet.create({
          userId: tournament.organizerId,
          balance: 0,
          transactions: []
        });
      }

      organizerWallet.balance += tournament.entryFee;
      organizerWallet.transactions.unshift({
        type: 'tournament_fee',
        amount: tournament.entryFee,
        balance: organizerWallet.balance,
        description: `Registration fee from ${req.user.username} for ${tournament.name}`,
        tournamentId: tournament._id,
        tournamentName: tournament.name,
        relatedUserId: req.user._id,
        relatedUserName: req.user.username
      });
      await organizerWallet.save();
    }

    // Create registration
    const registration = await Registration.create({
      tournamentId,
      playerId: req.user._id,
      playerName: req.user.username,
      teamName,
      email,
      phone,
      inGameId,
      amountPaid: tournament.entryFee
    });

    // Update tournament registered teams count
    tournament.registeredTeams += 1;
    await tournament.save();

    res.status(201).json({
      success: true,
      data: registration
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all registrations
// @route   GET /api/registrations
// @access  Private
export const getRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate('tournamentId', 'name startDate status')
      .populate('playerId', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get registrations by player
// @route   GET /api/registrations/player/:playerId
// @access  Private
export const getRegistrationsByPlayer = async (req, res) => {
  try {
    const registrations = await Registration.find({ playerId: req.params.playerId })
      .populate('tournamentId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get registrations by tournament
// @route   GET /api/registrations/tournament/:tournamentId
// @access  Public
export const getRegistrationsByTournament = async (req, res) => {
  try {
    const registrations = await Registration.find({ tournamentId: req.params.tournamentId })
      .populate('playerId', 'username email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cancel registration
// @route   DELETE /api/registrations/:id
// @access  Private
export const cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Check if user owns this registration
    if (registration.playerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this registration'
      });
    }

    await registration.deleteOne();

    // Update tournament registered teams count
    const tournament = await Tournament.findById(registration.tournamentId);
    if (tournament) {
      tournament.registeredTeams -= 1;
      await tournament.save();
    }

    res.status(200).json({
      success: true,
      message: 'Registration cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
