import express from 'express';
import { loginUser } from './user_controller';

const router = express.Router();

// Route pour le login
router.post('/login', loginUser);

export default router;