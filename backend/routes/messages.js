// Message Routes - Support/Contact messages
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/messages
// @desc    Submit a support message
// @access  Public (no authentication required)
router.post('/', async (req, res, next) => {
  try {
    console.log('📧 Received message submission:', req.body);
    
    const { username, email, subject, message } = req.body;

    // Validation
    if (!username || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const newMessage = await Message.create({
      username,
      email,
      subject,
      message,
      userId: null // Public submission, no user ID
    });

    console.log('✅ Support message saved:', newMessage._id);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (error) {
    console.error('❌ Error saving message:', error);
    next(error);
  }
});

// @route   GET /api/messages
// @desc    Get all messages (organizer only)
// @access  Private/Organizer
router.get('/', protect, authorize('organizer'), async (req, res, next) => {
  try {
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'username email');

    const unreadCount = await Message.countDocuments({ status: 'unread' });

    res.json({
      success: true,
      count: messages.length,
      unreadCount,
      messages
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/messages/:id/read
// @desc    Mark message as read
// @access  Private/Organizer
router.put('/:id/read', protect, authorize('organizer'), async (req, res, next) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { status: 'read' },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.json({
      success: true,
      message: message
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/messages/:id
// @desc    Delete a message
// @access  Private/Organizer
router.delete('/:id', protect, authorize('organizer'), async (req, res, next) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
