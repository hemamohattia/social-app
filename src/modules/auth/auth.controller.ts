import { Router, type Request, type Response } from 'express';
import authService from './auth.service.js';
import { addFCM } from '../../common/services/fcm-token.service.js';
import { validate } from '../../middleware/validation.middleware.js';
import { registerSchema, loginSchema } from './auth.schema.js';
import { authGuard } from '../../middleware/auth.middleware.js';
import passport from '../../config/passport.config.js';
import { generateAccessToken } from '../../utils/jwt.utils.js';

const router = Router();

router.post('/register', validate(registerSchema), async (req: Request, res: Response) => {
    try {
        const result = await authService.register(req.body);
        return res.status(201).json({ message: 'Registered Successfully', result });
    } catch (err: any) {
        return res.status(400).json({ message: err.message });
    }
});

router.post('/login', validate(loginSchema), async (req: Request, res: Response) => {
    try {
        const result = await authService.login(req.body);
        if ((req as any).session) (req as any).session.user = result.user;
        if (req.body.fcmToken) await addFCM(result.user.id.toString(), req.body.fcmToken);
        return res.status(200).json({ message: 'Login Successfully', accessToken: result.accessToken, refreshToken: result.refreshToken });
    } catch (err: any) {
        return res.status(401).json({ message: err.message });
    }
});

router.post('/logout', authGuard, async (req: Request, res: Response) => {
    try {
        const token = (req as any).token;
        if (token) await authService.logout(token);
        const session = (req as any).session;
        if (session) {
            session.destroy((err: any) => {
                if (err) return res.status(500).json({ message: 'Logout failed' });
                res.clearCookie('connect.sid');
                return res.status(200).json({ message: 'Logged out successfully' });
            });
        } else {
            return res.status(200).json({ message: 'Logged out successfully' });
        }
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
});

router.post('/refresh-token', async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });
        const result = await authService.refreshToken(refreshToken);
        return res.status(200).json(result);
    } catch (err: any) {
        return res.status(401).json({ message: 'Invalid refresh token' });
    }
});

router.post('/forgot-password', async (req: Request, res: Response) => {
    try {
        await authService.forgotPassword(req.body.email);
        return res.status(200).json({ message: 'OTP sent to your email' });
    } catch (err: any) {
        return res.status(400).json({ message: err.message });
    }
});

router.post('/reset-password', async (req: Request, res: Response) => {
    try {
        const { email, otp, newPassword } = req.body;
        await authService.resetPassword(email, otp, newPassword);
        return res.status(200).json({ message: 'Password reset successfully' });
    } catch (err: any) {
        return res.status(400).json({ message: err.message });
    }
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { session: false }),
    (req: Request, res: Response) => {
        const user = req.user as any;
        const accessToken = generateAccessToken({ id: user._id, role: user.role });
        return res.status(200).json({ message: 'Google login successful', accessToken });
    }
);

export default router;