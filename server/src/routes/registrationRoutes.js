// Registration Routes
import express from 'express';
import {
  registerForTournament,
  getRegistrations,
  getRegistrationsByPlayer,
  getRegistrationsByTournament,
  cancelRegistration
} from '../controllers/registrationController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getRegistrations)
  .post(protect, restrictTo('player'), registerForTournament);

router.get('/player/:playerId', protect, getRegistrationsByPlayer);
router.get('/tournament/:tournamentId', getRegistrationsByTournament);
router.delete('/:id', protect, cancelRegistration);

export default router;
