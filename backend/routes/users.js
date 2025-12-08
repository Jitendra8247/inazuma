// User Routes
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/users
// @desc    Get all users (organizer only)
// @access  Private/Organizer
router.get('/', protect, authorize('organizer'), async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private
router.put('/:id', protect, async (req, res, next) => {
  try {
    console.log('\n========================================');
    console.log('📝 PUT /api/users/:id - Update user');
    console.log('========================================');
    console.log('User ID:', req.params.id);
    console.log('Requester role:', req.user.role);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('========================================\n');

    // Check if user is updating their own profile or is organizer
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'organizer') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }

    // Get current user first
    const currentUser = await User.findById(req.params.id);
    
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    console.log('Current stats:', currentUser.stats);
    
    const updateData = {};
    
    // Regular users can only update username and avatar
    if (req.user._id.toString() === req.params.id) {
      if (req.body.username) updateData.username = req.body.username;
      if (req.body.avatar) updateData.avatar = req.body.avatar;
    }
    
    // Organizers can update stats (merge with existing stats)
    if (req.user.role === 'organizer' && req.body.stats) {
      // Update each stat field individually
      if (req.body.stats.tournamentsWon !== undefined) {
        currentUser.stats.tournamentsWon = req.body.stats.tournamentsWon;
      }
      if (req.body.stats.totalEarnings !== undefined) {
        currentUser.stats.totalEarnings = req.body.stats.totalEarnings;
      }
      if (req.body.stats.totalFinishes !== undefined) {
        currentUser.stats.totalFinishes = req.body.stats.totalFinishes;
      }
      
      console.log('Updated stats:', currentUser.stats);
      
      // Save the user
      await currentUser.save();
      
      console.log('✅ Stats saved to database');
      
      // Return updated user without password
      const updatedUser = await User.findById(req.params.id).select('-password');
      
      res.json({
        success: true,
        user: updatedUser
      });
      return;
    }
    
    // For non-stats updates, use findByIdAndUpdate
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    console.log('✅ Updated user');

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('❌ Error updating user:', error);
    next(error);
  }
});

module.exports = router;
