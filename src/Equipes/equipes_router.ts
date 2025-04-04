import { Router } from 'express';
import { getAllEquipes } from './equipes_controller';

export const coureur_router = Router();

// Route pour récupérer les noms des coureurs
coureur_router.get('/', getAllEquipes);
