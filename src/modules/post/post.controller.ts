import { Router, type Request, type Response } from 'express';
import postService from './post.service.js';
import { authGuard } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validation.middleware.js';
import { createPostSchema, updatePostSchema, reactionSchema } from './post.schema.js';
import { generatePDF } from '../../utils/pdf.utils.js';
import { generateQR } from '../../utils/qr.utils.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await postService.getAllPosts(Number(req.query.page) || 1, Number(req.query.limit) || 10);
        return res.status(200).json({ message: 'Posts fetched', result });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
});

router.get('/feed', authGuard, async (req: Request, res: Response) => {
    try {
        const result = await postService.getNewsFeed(Number(req.query.page) || 1, Number(req.query.limit) || 10);
        return res.status(200).json({ message: 'Feed fetched', result });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
});

router.get('/my-posts', authGuard, async (req: Request, res: Response) => {
    try {
        const result = await postService.getUserPosts((req as any).user.id);
        return res.status(200).json({ message: 'My posts fetched', result });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
});

router.get('/:postId/pdf', async (req: Request, res: Response) => {
    try {
        const post = await postService.getPostById(req.params.postId);
        const pdf = await generatePDF({ title: post.title, content: post.content });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="post-${post._id}.pdf"`);
        return res.send(pdf);
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
});

router.get('/:postId/qr', async (req: Request, res: Response) => {
    try {
        const post = await postService.getPostById(req.params.postId);
        const qr = await generateQR(`${process.env.APP_URL}/post/${post._id}`);
        return res.status(200).json({ message: 'QR generated', qr });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
});

router.get('/:postId', async (req: Request, res: Response) => {
    try {
        const result = await postService.getPostById(req.params.postId);
        return res.status(200).json({ message: 'Post fetched', result });
    } catch (err: any) {
        return res.status(404).json({ message: err.message });
    }
});

router.post('/', authGuard, upload.single('image'), validate(createPostSchema), async (req: Request, res: Response) => {
    try {
        const result = await postService.createPost(req.body, (req as any).user.id, req.file);
        return res.status(201).json({ message: 'Post created', result });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
});

router.patch('/:postId', authGuard, upload.single('image'), validate(updatePostSchema), async (req: Request, res: Response) => {
    try {
        const result = await postService.updatePost(req.params.postId, (req as any).user.id, req.body, req.file);
        return res.status(200).json({ message: 'Post updated', result });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
});

router.delete('/:postId', authGuard, async (req: Request, res: Response) => {
    try {
        await postService.softDeletePost(req.params.postId, (req as any).user.id);
        return res.status(200).json({ message: 'Post deleted' });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
});

router.post('/:postId/react', authGuard, validate(reactionSchema), async (req: Request, res: Response) => {
    try {
        const result = await postService.reactToPost(req.params.postId, (req as any).user.id, req.body.type);
        return res.status(200).json({ message: 'Reaction updated', result });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
});

export default router;