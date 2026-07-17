import { Router, type Request, type Response } from 'express';
import { authGuard } from '../../middleware/auth.middleware.js';
import { ChatService } from '../../socket/socket.service.js';

const router = Router();
const chatService = new ChatService();

router.get('/:userId', authGuard, async (req: Request, res: Response) => {
    try {
        const result = await chatService.getMessages(
            (req as any).user.id,
            req.params.userId,
            Number(req.query.page) || 1,
            Number(req.query.limit) || 20
        );
        return res.status(200).json({ message: 'Messages fetched', result });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
});

router.get('/group/:roomId', authGuard, async (req: Request, res: Response) => {
    try {
        const result = await chatService.getGroupMessages(
            req.params.roomId,
            Number(req.query.page) || 1,
            Number(req.query.limit) || 20
        );
        return res.status(200).json({ message: 'Group messages fetched', result });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
});

export default router;