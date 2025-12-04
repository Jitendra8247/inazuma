// Tournament Routes
import express from 'express';
import {
  getTournaments,
  getTournament,
  createTournament,
  updateTournament,
  deleteTournament,
  getTournamentsByOrganizer
} from '../controllers/tournamentController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getTournaments)
  .post(protect, restrictTo('organizer'), createTournament);

router.route('/:id')
  .get(getTournament)
  .put(protect, restrictTo('organizer'), updateTournament)
  .delete(protect, restrictTo('organizer'), deleteTournament);

router.get('/organizer/:organizerId', getTournamentsByOrganizer);

export default router;
