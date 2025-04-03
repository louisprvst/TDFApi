import { Request, Response } from 'express';
import prisma from '../client';

// Fonction pour récupérer toutes les étapes
export const getAllEtapes = async (req: Request, res: Response): Promise<void> => {
    try {
        // Récupérer toutes les étapes
        const etapes = await prisma.etapes.findMany();

        // Vérifier si des étapes ont été trouvées
        if (!etapes || etapes.length === 0) {
            res.status(404).send('Aucune étape trouvée');
            return;
        }

        // Renvoyer toutes les étapes
        res.status(200).send(etapes);
    } catch (error) {
        console.error('Erreur lors de la récupération des étapes :', error);
        res.status(500).send('Erreur interne du serveur');
    }
};

// Fonction pour récupérer les étapes par année
export const getEtapesByAnnee = async (req: Request, res: Response): Promise<void> => {
    const { annee } = req.params;

    // Vérification de l'année
    if (!annee) {
        res.status(400).send("L'année est requise");
        return;
    }

    try {
        // Récupérer les étapes pour l'année spécifiée
        const etapes = await prisma.etapes.findMany({
            where: {
                date: {
                    gte: new Date(`${annee}-01-01`),
                    lte: new Date(`${annee}-12-31`),
                },
            },
        });

        // Vérifier si des étapes ont été trouvées
        if (!etapes || etapes.length === 0) {
            res.status(404).send(`Aucune étape trouvée pour l'année ${annee}`);
            return;
        }

        // Renvoyer les étapes
        res.status(200).send(etapes);
    } catch (error) {
        console.error(`Erreur lors de la récupération des étapes pour l'année ${annee} :`, error);
        res.status(500).send('Erreur interne du serveur');
    }
};