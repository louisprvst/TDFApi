import { Router } from 'express';
import { loginUser, registerUser, getUsers, deleteUser, updateUser } from './user_controller';

export const user_router = Router();


user_router.post('/login', loginUser);

user_router.post('/register', registerUser);

user_router.get('/list', getUsers);

user_router.delete('/delete/:id', deleteUser);

user_router.patch('/update/:id', updateUser);