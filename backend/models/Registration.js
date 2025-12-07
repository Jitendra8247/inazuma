// Registration Model
const mongoose = require('mongoose');

// Player details sub-schema
const playerDetailsSchema = new mongoose.Schema({
  inGameName: {
    type: String,
    required: [true, 'In-game name is required'],
    trim: true
  },
  bgmiId: {
    type: String,
    required: [true, 'BGMI ID is required'],
    trim: true
  }
}, { _id: false });

const registrationSchema = new mongoose.Schema({
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: [true, 'Tournament ID is required']
  },
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Player ID is required']
  },
  mode: {
    type: String,
    enum: ['Solo', 'Duo', 'Squad'],
    required: [true, 'Tournament mode is required']
  },
  // For Solo mode
  player: {
    type: playerDetailsSchema
  },
  // For Duo/Squad modes
  teamName: {
    type: String,
    trim: true
  },
  player1: {
    type: playerDetailsSchema
  },
  player2: {
    type: playerDetailsSchema
  },
  player3: {
    type: playerDetailsSchema
  },
  player4: {
    type: playerDetailsSchema
  },
  // Contact information
  email: {
    type: String,
    required: [true, 'Email is required']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected', 'cancelled'],
    default: 'confirmed'
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Custom validation for mode-specific fields
registrationSchema.pre('validate', function(next) {
  if (this.mode === 'Solo') {
    if (!this.player || !this.player.inGameName || !this.player.bgmiId) {
      return next(new Error('Player details (in-game name and BGMI ID) are required for Solo mode'));
    }
  } else if (this.mode === 'Duo') {
    if (!this.teamName) {
      return next(new Error('Team name is required for Duo mode'));
    }
    if (!this.player1 || !this.player1.inGameName || !this.player1.bgmiId) {
      return next(new Error('Player 1 details are required for Duo mode'));
    }
    if (!this.player2 || !this.player2.inGameName || !this.player2.bgmiId) {
      return next(new Error('Player 2 details are required for Duo mode'));
    }
  } else if (this.mode === 'Squad') {
    if (!this.teamName) {
      return next(new Error('Team name is required for Squad mode'));
    }
    if (!this.player1 || !this.player1.inGameName || !this.player1.bgmiId) {
      return next(new Error('Player 1 details are required for Squad mode'));
    }
    if (!this.player2 || !this.player2.inGameName || !this.player2.bgmiId) {
      return next(new Error('Player 2 details are required for Squad mode'));
    }
    if (!this.player3 || !this.player3.inGameName || !this.player3.bgmiId) {
      return next(new Error('Player 3 details are required for Squad mode'));
    }
    if (!this.player4 || !this.player4.inGameName || !this.player4.bgmiId) {
      return next(new Error('Player 4 details are required for Squad mode'));
    }
  }
  next();
});

// Compound index to prevent duplicate registrations
registrationSchema.index({ tournamentId: 1, playerId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
