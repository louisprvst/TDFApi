import express from 'express';
import { user_router } from './Users/user_router';
import { coureur_router } from './Coureurs/coureur_router';

const app = express();
const port = process.env.PORT || 11048;

app.use(express.json());

// Utiliser le routeur pour les utilisateurs
app.use('/user', user_router);

// Utiliser le routeur pour les coureurs
app.use('/coureurs', coureur_router);

export const server = app.listen(port);

export function stopServer() {
  server.close();
}