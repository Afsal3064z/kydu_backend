import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';

interface DecodedToken {
    userId: string;
}

const SECRET_KEY = process.env.JWT_SECRET as string;
const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided." });
    }

    if (!token.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Unauthorized: Invalid token format." });
    }

    const tokenValue = token.slice(7);

    try {
        const decodedToken = jwt.verify(tokenValue, SECRET_KEY) as DecodedToken;

        req.user = decodedToken;

        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: "Unauthorized: Invalid token." });
    }
};

export default isLoggedIn;
