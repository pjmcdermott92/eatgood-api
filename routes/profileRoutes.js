import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { createOrUpdateProfile, getAllProfiles, getFavoritedRecipes, getOneProfileByUserId } from '../controllers/profileControllers.js';

const router = express.Router();

router.post('/', authenticate, createOrUpdateProfile);
router.get('/', authenticate, getAllProfiles);
router.get('/:userId', authenticate, getOneProfileByUserId);
router.get('/:userId/favorites', authenticate, getFavoritedRecipes);

export default router;
