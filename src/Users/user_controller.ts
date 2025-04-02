import { Request, Response } from 'express';
import prisma from '../client';
import md5 from 'md5';
import jwt from 'jsonwebtoken';

// Fonction pour se connecter
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    // Vérification des champs requis
    if (!username) {
        res.status(400).send("Le champ 'username' est vide");
        return;
    }

    if (!password) {
        res.status(400).send("Le champ 'password' est vide");
        return;
    }

    try {
        // Vérifier si l'utilisateur existe
        const user = await prisma.users.findUnique({
            where: { username: username },
        });

        if (!user) {
            res.status(400).send("L'utilisateur n'existe pas");
            return;
        }

        // Vérifier le mot de passe
        const hashedPassword = md5(password);
        if (hashedPassword !== user.password) {
            res.status(400).send('Mot de passe incorrect');
            return;
        }

        // Générer un jeton JWT
        const token = jwt.sign(
            { userId: user.id, username: user.username, admin: user.admin },
            process.env.JWT_SECRET as jwt.Secret,
        );

        // Répondre avec le token
        res.status(200).send(token);
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        res.status(500).send('Erreur interne du serveur');
    }
};

// Fonction pour enregistrer un utilisateur
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    // Vérification des champs requis
    if (!username) {
        res.status(400).send("Le champ 'username' est vide");
        return;
    }

    if (!password) {
        res.status(400).send("Le champ 'password' est vide");
        return;
    }

    try {
        // Vérifier si le nom d'utilisateur existe déjà
        const existingUser = await prisma.users.findUnique({
            where: { username: username },
        });

        if (existingUser) {
            res.status(400).send("Le nom d'utilisateur est déjà pris");
            return;
        }

        const hashedPassword = md5(password);

        // Créer un nouvel utilisateur avec admin = false
        const newUser = await prisma.users.create({
            data: {
                username: username,
                password: hashedPassword,
                admin: false,
            },
        });

        res.status(201).send(`Utilisateur créé avec succès : ${newUser.username}`);
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement :', error);
        res.status(500).send('Erreur interne du serveur');
    }
};