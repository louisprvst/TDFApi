import express from 'express';
import { user_router } from './Users/user_router';

const app = express();
const port = process.env.PORT || 2022;

app.use(express.json());

// Utiliser le routeur pour les utilisateurs
app.use('/user', user_router);

export const server = app.listen(port);

export function stopServer() {
  server.close();
}