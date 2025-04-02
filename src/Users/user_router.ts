import { Router } from 'express';
import { loginUser, registerUser } from './user_controller';

export const user_router = Router();

// Route pour se connecter
user_router.post('/login', loginUser);

// Route pour s'enregistrer
user_router.post('/register', registerUser);