import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { IAuthSocket } from './socket.interface.js';
import { ChatEvents } from './socket.events.js';

let io: Server | undefined;
export const connectedSockets = new Map<string, string>();

export const initSocket = (httpServer: HttpServer) => {
    io = new Server(httpServer, { cors: { origin: '*' } });

    io.use((socket: IAuthSocket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) return next(new Error('Unauthorized'));
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
            socket.user = { id: decoded.id, role: decoded.role };
            connectedSockets.set(decoded.id, socket.id);
            next();
        } catch {
            next(new Error('Invalid token'));
        }
    });

    io.on('connection', (socket: IAuthSocket) => {
        console.log(`User connected: ${socket.user?.id}`);
        new ChatEvents(socket, io!).register();
        socket.on('disconnect', () => {
            if (socket.user?.id) connectedSockets.delete(socket.user.id);
        });
    });
};

export const getIo = (): Server => {
    if (!io) throw new Error('Socket.io not initialized');
    return io;
};