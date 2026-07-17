import express, { type Application, type Request, type Response, type NextFunction } from 'express';
import session from 'express-session';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import passport from './config/passport.config.js';
import authRouter from './modules/auth/index.js';
import userRouter from './modules/user/index.js';
import postRouter from './modules/post/index.js';
import commentRouter from './modules/comment/index.js';
import notificationRouter from './modules/notification/index.js';
import storyRouter from './modules/story/index.js';
import chatRouter from './modules/chat/chat.controller.js';
import { redisClient } from './common/services/redis.service.js';

const bootstrap = (app: Application) => {
    app.set('trust proxy', 1);

    app.use(helmet());

    app.use(cors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));

    app.use(rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: { message: 'Too many requests, please try again later' },
        standardHeaders: true,
        legacyHeaders: false,
        store: new RedisStore({
            sendCommand: (...args: string[]) => redisClient.sendCommand(args)
        })
    }));

    app.use(express.json());

    app.use(session({
        secret: process.env.SESSION_SECRET || 'default_secret',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: process.env.NODE_ENV === 'production' }
    }));

    app.use(passport.initialize());

    app.use('/auth', authRouter);
    app.use('/user', userRouter);
    app.use('/post', postRouter);
    app.use('/comment', commentRouter);
    app.use('/notification', notificationRouter);
    app.use('/story', storyRouter);
    app.use('/chat', chatRouter);

    app.use((req: Request, res: Response) => {
        res.status(404).json({ message: 'Route Not Found' });
    });

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
    });
};

export default bootstrap;