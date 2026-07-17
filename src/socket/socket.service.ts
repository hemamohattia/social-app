import { MessageModel } from './message.model.js';

export class ChatService {
    public saveMessage = async ({ from, to, content, isGroup = false }: { from: string; to: string; content: string; isGroup?: boolean }) => {
        return await MessageModel.create({ from, to, content, isGroup });
    };

    public getMessages = async (userId1: string, userId2: string, page = 1, limit = 20) => {
        const skip = (page - 1) * limit;
        return await MessageModel.find({
            $or: [{ from: userId1, to: userId2 }, { from: userId2, to: userId1 }]
        }).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('from', 'userName profileImage');
    };

    public getGroupMessages = async (roomId: string, page = 1, limit = 20) => {
        const skip = (page - 1) * limit;
        return await MessageModel.find({ to: roomId, isGroup: true })
            .sort({ createdAt: -1 }).skip(skip).limit(limit).populate('from', 'userName profileImage');
    };
}