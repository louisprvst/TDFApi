import express from 'express';
import { user_router } from './Users/user_router';
import { coureur_router } from './Coureurs/coureur_router';
import { etapes_router } from './Etapes/etapes_router';

const app = express();
const port = 11048;

app.use(express.json());

// Utiliser le routeur pour les utilisateurs
app.use('/user', user_router);

// Utiliser le routeur pour les coureurs
app.use('/coureurs', coureur_router);

// Utiliser le routeur pour les étapes
app.use('/etapes', etapes_router);

export const server = app.listen(port, "0.0.0.0", () => {
  console.log('Serveur démarré sur le port ${port}');
});

export function stopServer() {
  server.close();
}