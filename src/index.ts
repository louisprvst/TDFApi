import express from 'express';
import userRouter from './Users/user_router';

const app = express();

app.use(express.json());

// Utiliser le routeur pour les utilisateurs
app.use('/api', userRouter);

app.listen(3000, () => {
    console.log('Serveur démarré sur http://localhost:3000');
});