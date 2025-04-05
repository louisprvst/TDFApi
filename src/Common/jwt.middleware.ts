import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyJWT = (req: any, res: any, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header manquant' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET as jwt.Secret
        ) as {
            userId: string;
            admin: boolean;
        };

        // Ajouter les informations du token à la requête
        req.query = {
            userId: decodedToken.userId,
            admin: decodedToken.admin.toString(),
        };

        next();
    } catch (error) {
        console.error('Erreur de vérification du token JWT :', error);
        return res.status(403).json({ error: 'Token invalide ou expiré' });
    }
};