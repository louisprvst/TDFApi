import express from 'express';
import authRoutes from './Users/auth_routes';

const app = express();

app.use(express.json()); // Pour analyser les requêtes JSON

// Ajouter les routes d'authentification
app.use('/api/auth', authRoutes);

app.listen(3000, () => {
    console.log('Serveur démarré sur http://localhost:3000');
});