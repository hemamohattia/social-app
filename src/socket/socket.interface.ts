import { Socket } from 'socket.io';

export interface IAuthSocket extends Socket {
    user?: { id: string; role: string };
}