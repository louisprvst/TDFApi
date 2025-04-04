import { Request, Response } from 'express';
import prisma from '../client';

// Fonction pour récupérer les noms des coureurs
export const getNomsCoureurs = async (req: Request, res: Response): Promise<void> => {
    try {
        // Récupération avec Prisma sans raw SQL
        const coureurs = await prisma.classements.findMany({
            select: { coureur: true },
            distinct: ['coureur'],
        });

        // Vérifier si des coureurs ont été trouvés
        if (!coureurs || coureurs.length === 0) {
            res.status(404).send('Aucun coureur trouvé');
            return;
        }

        // Renvoyer les noms des coureurs sous forme de JSON
        res.status(200).send(coureurs.map(c => c.coureur));
    } catch (error) {
        console.error('Erreur lors de la récupération des noms des coureurs :', error);
        res.status(500).send('Erreur interne du serveur');
    }
};

// Fonction pour récupérer les coureurs par année
export const getCoureursByAnnee = async (req: Request, res: Response): Promise<void> => {
    const { annee } = req.params;

    // Vérification de l'année
    if (!annee) {
        res.status(400).send("L'année est requise");
        return;
    }

    try {
        // Récupérer les coureurs pour l'année spécifiée
        const coureurs = await prisma.classements.findMany({
            where: { annee: parseInt(annee) },
        });

        // Vérifier si des coureurs ont été trouvés
        if (!coureurs || coureurs.length === 0) {
            res.status(404).send(`Aucun coureur trouvé pour l'année ${annee}`);
            return;
        }

        // Renvoyer les informations des coureurs
        res.status(200).send(coureurs);
    } catch (error) {
        console.error(`Erreur lors de la récupération des coureurs pour l'année ${annee} :`, error);
        res.status(500).send('Erreur interne du serveur');
    }
};