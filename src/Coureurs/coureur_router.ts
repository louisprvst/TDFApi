import { Router } from 'express';
import { getNomsCoureurs } from './coureur_controller';

export const coureur_router = Router();

// Route pour récupérer les noms des coureurs
coureur_router.get('/noms-coureurs', getNomsCoureurs);