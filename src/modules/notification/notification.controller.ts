import { Router, type Request, type Response } from 'express';
import notificationService from './notification.service.js';
import { authGuard } from '../../middleware/auth.middleware.js';

const router = Router();

const adminGuard = (req: Request, res: Response, next: any) => {
    if ((req as any).user?.role !== 'admin') {
        return res.status(403).json({ message: "Admins only" });
    }
    return next();
};

router.post("/", authGuard, adminGuard, async (req: Request, res: Response) => {
    try {
        const result = await notificationService.createNotification(req.body, (req as any).user.id);
        res.status(201).json({ message: "Notification Sent", result });
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

router.get("/", authGuard, async (req: Request, res: Response) => {
    try {
        const notifications = await notificationService.getUserNotifications((req as any).user.id);
        res.status(200).json(notifications);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

router.patch("/:id/read", authGuard, async (req: Request, res: Response) => {
    try {
        await notificationService.markAsRead(req.params.id as string);
        res.status(200).json({ message: "Marked as read" });
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

router.delete("/:id", authGuard, adminGuard, async (req: Request, res: Response) => {
    try {
        await notificationService.deleteNotification(req.params.id as string);
        res.status(200).json({ message: "Notification Deleted" });
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

export default router;