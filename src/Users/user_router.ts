import { Router } from 'express';
import { loginUser } from './user_controller';
 
export const user_router = Router();


// Router pour se connecter
user_router.post('/login', loginUser)