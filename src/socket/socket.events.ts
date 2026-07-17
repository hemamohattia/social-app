import { Server } from 'socket.io';
import { IAuthSocket } from './socket.interface.js';
import { ChatService } from './socket.service.js';
import { connectedSockets } from './socket.gateway.js';

export class ChatEvents {
    private chatService: ChatService;

    constructor(private socket: IAuthSocket, private io: Server) {
        this.chatService = new ChatService();
    }

    register() {
        this.sendMessage();
        this.joinRoom();
        this.sendGroupMessage();
        this.typing();
    }

    private sendMessage() {
        this.socket.on('sendMessage', async ({ to, content }: { to: string; content: string }) => {
            try {
                const message = await this.chatService.saveMessage({ from: this.socket.user!.id, to, content });
                const receiverSocketId = connectedSockets.get(to);
                if (receiverSocketId) this.io.to(receiverSocketId).emit('newMessage', message);
                this.socket.emit('messageSent', message);
            } catch (err: any) {
                this.socket.emit('error', { message: err.message });
            }
        });
    }

    private joinRoom() {
        this.socket.on('joinRoom', ({ roomId }: { roomId: string }) => {
            try {
                this.socket.join(roomId);
                this.socket.emit('joinedRoom', { roomId });
            } catch (err: any) {
                this.socket.emit('error', { message: err.message });
            }
        });
    }

    private sendGroupMessage() {
        this.socket.on('sendGroupMessage', async ({ roomId, content }: { roomId: string; content: string }) => {
            try {
                const message = await this.chatService.saveMessage({ from: this.socket.user!.id, to: roomId, content, isGroup: true });
                this.io.to(roomId).emit('newGroupMessage', message);
            } catch (err: any) {
                this.socket.emit('error', { message: err.message });
            }
        });
    }

    private typing() {
        this.socket.on('typing', ({ to }: { to: string }) => {
            const receiverSocketId = connectedSockets.get(to);
            if (receiverSocketId) this.io.to(receiverSocketId).emit('userTyping', { from: this.socket.user?.id });
        });
    }
}