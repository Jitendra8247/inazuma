// Tournament Routes
const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/tournaments
// @desc    Get all tournaments
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { status, game, mode } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (game) filter.game = game;
    if (mode) filter.mode = mode;

    const tournaments = await Tournament.find(filter).sort({ startDate: -1 });
    
    res.json({
      success: true,
      count: tournaments.length,
      tournaments
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/tournaments/:id
// @desc    Get tournament by ID
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    res.json({
      success: true,
      tournament
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/tournaments
// @desc    Create tournament
// @access  Private/Organizer
router.post('/', protect, authorize('organizer'), async (req, res, next) => {
  try {
    const tournamentData = {
      ...req.body,
      organizerId: req.user._id,
      organizer: req.user.username
    };

    const tournament = await Tournament.create(tournamentData);
    
    res.status(201).json({
      success: true,
      tournament
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/tournaments/:id
// @desc    Update tournament
// @access  Private/Organizer
router.put('/:id', protect, authorize('organizer'), async (req, res, next) => {
  try {
    let tournament = await Tournament.findById(req.params.id);
    
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    // Check if user is the organizer
    if (tournament.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this tournament'
      });
    }

    tournament = await Tournament.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      tournament
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/tournaments/:id
// @desc    Delete tournament
// @access  Private/Organizer
router.delete('/:id', protect, authorize('organizer'), async (req, res, next) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    // Check if user is the organizer
    if (tournament.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this tournament'
      });
    }

    await tournament.deleteOne();

    res.json({
      success: true,
      message: 'Tournament deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
