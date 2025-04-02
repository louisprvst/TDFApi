import { Request, Response } from 'express';
import prisma from '../client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Le champ 'email' est vide" });
    }

    if (!password) {
        return res.status(400).json({ error: "Le champ 'password' est vide" });
    }

    try {
        // Vérifier si l'utilisateur existe
        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            return res.status(400).json({ error: "L'utilisateur n'existe pas" });
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Mot de passe incorrect' });
        }

        // Générer un jeton JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET as jwt.Secret,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        return res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};