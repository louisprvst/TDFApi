import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        try {
            const decodedToken = jwt.verify(
                token,
                process.env.JWT_SECRET as jwt.Secret
            ) as {
                userId: string;
            };

            const userId = decodedToken.userId;

            // Vérification de l'utilisateur dans la base de données PostgreSQL
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                return res.status(401).json({ message: 'Utilisateur non trouvé' });
            }

            req.query = {
                userId: userId,
            };
            next();
        } catch (error) {
            return res.status(403).json({ message: 'Token invalide' });
        }
    } else {
        res.sendStatus(401);
    }
};