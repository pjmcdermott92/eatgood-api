import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import userRoutes from './userRoutes.js';
import profileRoutes from './profileRoutes.js';
import recipeRoutes from './recipeRoutes.js';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/profiles', authenticate, profileRoutes);
router.use('/recipes', authenticate, recipeRoutes);

export default router;
