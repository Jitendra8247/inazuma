// User Routes
import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserStats,
  deactivateUser,
  activateUser
} from '../controllers/userController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and organizer role
router.use(protect, restrictTo('organizer'));

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id/stats', updateUserStats);
router.put('/:id/deactivate', deactivateUser);
router.put('/:id/activate', activateUser);

export default router;
