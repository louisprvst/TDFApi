import { Request, Response } from 'express';
import prisma from '../client';

// Route pour récupérer toutes les équipes
export const getAllEquipes = async (req: Request, res: Response) => {
    try {
        const equipes = await prisma.equipes.findMany(); 
        res.status(200).send(equipes); 
    } catch (error) {
        console.error('Erreur lors de la récupération des équipes:', error);
        res.status(500).send({ error: 'Erreur serveur' });
    }
};