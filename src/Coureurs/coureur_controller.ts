import { Request, Response } from 'express';
import prisma from '../client';

// Fonction pour récupérer les noms des coureurs
export const getNomsCoureurs = async (req: Request, res: Response): Promise<void> => {
    try {
        // Récupération avec Prisma sans raw SQL
        const coureurs = await prisma.historiqueCoureurs.findMany({
            select: { coureur: true },
            distinct: ['coureur'],
        });

        // Vérifier si des coureurs ont été trouvés
        if (!coureurs || coureurs.length === 0) {
            res.status(404).json({ message: 'Aucun coureur trouvé' });
            return;
        }

        // Renvoyer les noms des coureurs sous forme de JSON
        res.status(200).json(coureurs.map(c => c.coureur));
    } catch (error) {
        console.error('Erreur lors de la récupération des noms des coureurs :', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};
