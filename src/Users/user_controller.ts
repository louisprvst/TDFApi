import { Request, Response } from 'express';
import prisma from '../client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Fonction pour se connecter
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    // Vérification des champs requis
    if (!username) {
        res.status(400).json({ error: "Le champ 'username' est vide" });
        return;
    }

    if (!password) {
        res.status(400).json({ error: "Le champ 'password' est vide" });
        return;
    }

    try {
        // Vérifier si l'utilisateur existe
        const user = await prisma.user.findUnique({
            where: { username: username },
        });

        if (!user) {
            res.status(400).json({ error: "L'utilisateur n'existe pas" });
            return;
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ error: 'Mot de passe incorrect' });
            return;
        }

        // Générer un jeton JWT
        const token = jwt.sign(
            { userId: user.id, username: user.username, admin: user.admin },
            process.env.JWT_SECRET as jwt.Secret,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        // Répondre avec le token
        res.status(200).json({ token });
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};