import http from "http";
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET as string;

const users = new Map<string, Socket>();
export { users };

interface DecodedToken {
    userId: string;
}

export const configSocket = (server: http.Server) => {
    const io = new Server(server, { cors: { origin: '*' } });

    /** Authentication */
    io.use((socket, next) => {
        const token = socket.handshake.headers.authorization;
    
        if (!token) {
            return next(new Error('Unauthorized: No token provided.'));
        }
    
        if (!token.startsWith('Bearer ')) {
            return next(new Error('Unauthorized: Invalid token format.'));
        }
    
        const tokenValue = token.slice(7);
    
        try {
            const decodedToken = jwt.verify(tokenValue, SECRET_KEY);
            (socket as any).decodedToken = decodedToken;
            next();
        } catch (error) {
            console.error(error);
            next(new Error('Unauthorized: Invalid token.'));
        }
    });

    /** Initial Connection */
    io.on('connection', (socket) => {
        console.log(`⚡ [socket] '${socket.id}' has connected. `);
        const user = (socket as any).decodedToken as DecodedToken;

        users.set(user.userId, socket);

        /** Disconnection */
        socket.on('disconnect', () => {
            console.log(`⚡ [socket] '${socket.id}' has disconnected. `);
            users.delete(user.userId);
        })
    });
}