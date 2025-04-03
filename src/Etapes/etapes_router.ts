import { Router } from 'express';
import { getAllEtapes, getEtapesByAnnee } from './etapes_controller';

export const etapes_router = Router();

// Route pour récupérer toutes les étapes
etapes_router.get('/', getAllEtapes);

// Route pour récupérer les étapes par année
etapes_router.get('/:annee', getEtapesByAnnee);