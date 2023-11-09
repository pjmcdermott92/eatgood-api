import express from 'express';
import { authenticate, generateAuthToken, logoutUser, sendAuthResponse } from '../middleware/authMiddleware.js';
import { authUser, changePassword, registerUser } from '../controllers/userControllers.js';

const router = express.Router();

router.post('/register', registerUser, generateAuthToken, sendAuthResponse);
router.post('/auth', authUser, generateAuthToken, sendAuthResponse);
router.post('/logout', logoutUser);
router.get('/me', authenticate, sendAuthResponse);
router.put('/password', authenticate, changePassword);

export default router;
