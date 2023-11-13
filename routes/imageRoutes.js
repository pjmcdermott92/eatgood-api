import express from 'express';
import { uploadImage } from '../controllers/imageControllers.js';

const router = express.Router();

router.post('/', uploadImage);

export default router;
