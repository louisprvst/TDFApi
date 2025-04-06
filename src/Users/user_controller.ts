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

        // Répondre avec le token, le statut admin et success
        res.status(200).send({ token, success: true, admin: user.admin});
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

        res.status(201).send(true);
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement :', error);
        res.status(500).send('Erreur interne du serveur');
    }
};

// Fonction pour récupérer tous les utilisateurs
export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        // Récupérer tous les utilisateurs depuis la base de données
        const users = await prisma.users.findMany({
            select: {
                id: true,
                username: true,
                admin: true,
            },
        });

        // Vérifier si des utilisateurs ont été trouvés
        if (!users || users.length === 0) {
            res.status(404).send('Aucun utilisateur trouvé');
            return;
        }

        // Renvoyer les utilisateurs sous forme de JSON
        res.status(200).json(users);
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
        res.status(500).send('Erreur interne du serveur');
    }
};

// Fonction pour supprimer un utilisateur
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    // Vérification de l'ID
    if (!id) {
        res.status(400).send("L'ID de l'utilisateur est requis");
        return;
    }

    try {
        // Vérifier si l'utilisateur existe
        const user = await prisma.users.findUnique({
            where: { id: parseInt(id) },
        });

        if (!user) {
            res.status(404).send("L'utilisateur n'existe pas");
            return;
        }

        // Supprimer l'utilisateur
        await prisma.users.delete({
            where: { id: parseInt(id) },
        });

        res.status(200).send(`Utilisateur avec l'ID ${id} supprimé avec succès`);
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur :', error);
        res.status(500).send('Erreur interne du serveur');
    }
};

// Fonction pour modifier un utilisateur
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { username, password, admin } = req.body;

    // Vérification de l'ID
    if (!id) {
        res.status(400).send("L'ID de l'utilisateur est requis");
        return;
    }

    // Vérification des champs à mettre à jour
    if (!username && !password && admin === undefined) {
        res.status(400).send("Aucun champ à mettre à jour n'a été fourni");
        return;
    }

    try {
        // Vérifier si l'utilisateur existe
        const user = await prisma.users.findUnique({
            where: { id: parseInt(id) },
        });

        if (!user) {
            res.status(404).send("L'utilisateur n'existe pas");
            return;
        }

        // Préparer les données à mettre à jour
        const updatedData: any = {};
        if (username) updatedData.username = username;
        if (password) updatedData.password = md5(password);
        if (admin !== undefined) updatedData.admin = admin;

        // Mettre à jour l'utilisateur
        const updatedUser = await prisma.users.update({
            where: { id: parseInt(id) },
            data: updatedData,
        });

        res.status(200).send(`Utilisateur avec l'ID ${id} mis à jour avec succès`);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
        res.status(500).send('Erreur interne du serveur');
    }
};