// User Controller
import User from '../models/User.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Organizer only)
export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    
    let query = {};
    if (role) query.role = role;

    const users = await User.find(query).select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private (Organizer only)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user stats
// @route   PUT /api/users/:id/stats
// @access  Private (Organizer only)
export const updateUserStats = async (req, res) => {
  try {
    const { tournamentsPlayed, tournamentsWon, totalEarnings, rank } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (tournamentsPlayed !== undefined) user.stats.tournamentsPlayed = tournamentsPlayed;
    if (tournamentsWon !== undefined) user.stats.tournamentsWon = tournamentsWon;
    if (totalEarnings !== undefined) user.stats.totalEarnings = totalEarnings;
    if (rank) user.stats.rank = rank;

    await user.save();

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Deactivate user
// @route   PUT /api/users/:id/deactivate
// @access  Private (Organizer only)
export const deactivateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Activate user
// @route   PUT /api/users/:id/activate
// @access  Private (Organizer only)
export const activateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User activated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
