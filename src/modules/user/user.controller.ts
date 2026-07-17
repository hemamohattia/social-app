import { Router, type Request, type Response } from 'express';
import userService from './user.service.js';
import { authGuard } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validation.middleware.js';
import { updateProfileSchema, updatePasswordSchema } from './user.schema.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get('/profile', authGuard, async (req: Request, res: Response) => {
    try {
        const result = await userService.findUserById((req as any).user.id);
        return res.status(200).json({ message: 'Profile fetched', result });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
});

router.patch('/update', authGuard, upload.single('profileImage'), validate(updateProfileSchema), async (req: Request, res: Response) => {
    try {
        const result = await userService.updateProfile((req as any).user.id, req.body, req.file);
        return res.status(200).json({ message: 'Profile updated', result });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
});

router.put('/update-password', authGuard, validate(updatePasswordSchema), async (req: Request, res: Response) => {
    try {
        await userService.updatePassword((req as any).user.id, req.body.oldPassword, req.body.newPassword);
        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (err: any) {
        return res.status(400).json({ message: err.message });
    }
});

router.delete('/delete', authGuard, async (req: Request, res: Response) => {
    try {
        await userService.softDelete((req as any).user.id);
        return res.status(200).json({ message: 'Account deleted' });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
});

export default router;