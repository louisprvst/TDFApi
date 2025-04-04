import { Router } from 'express';
import { getAllEquipes } from './equipes_controller';

export const equipes_router = Router();

// Route pour récupérer les noms des equipes
equipes_router.get('/', getAllEquipes);
