import { Router } from 'express';
import { getNomsCoureurs, getCoureursByAnnee } from './coureur_controller';

export const coureur_router = Router();

// Route pour récupérer les noms des coureurs
coureur_router.get('/noms', getNomsCoureurs);

// Route pour récupérer les coureurs par année
coureur_router.get('/:annee', getCoureursByAnnee);