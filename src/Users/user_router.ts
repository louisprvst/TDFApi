import { Router } from 'express';
import { loginUser, registerUser, getUsers, deleteUser, updateUser } from './user_controller';

export const user_router = Router();

// Route pour se connecter
user_router.post('/login', loginUser);

// Route pour s'enregistrer
user_router.post('/register', registerUser);

// Route pour récupérer tous les utilisateurs
user_router.get('/list', getUsers);

// Route pour supprimer un utilisateur
user_router.delete('/delete/:id', deleteUser);

// Route pour mettre à jour un utilisateur
user_router.patch('/update/:id', updateUser);