import { Router, type Response } from 'express';
import commentService from './comment.service.js';
import { authGuard } from '../../middleware/auth.middleware.js';
import { type IRequest } from '../../common/types/IRequest.js';

const router = Router();

router.post("/:postId", authGuard, async (req: IRequest, res: Response) => {
    try {
        const { postId } = req.params as { postId: string };
        const result = await commentService.createComment(req.body.content, req.user!.id, postId);
        res.status(201).json({ message: "Comment Created", result });
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

router.post("/:postId/reply/:commentId", authGuard, async (req: IRequest, res: Response) => {
    try {
        const { postId, commentId } = req.params as { postId: string; commentId: string };
        const result = await commentService.createReply(req.body.content, req.user!.id, postId, commentId);
        res.status(201).json({ message: "Reply Created", result });
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

router.get("/:postId", async (req: IRequest, res: Response) => {
    try {
        const { postId } = req.params as { postId: string };
        const comments = await commentService.getPostComments(postId);
        res.status(200).json(comments);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

router.patch("/:commentId", authGuard, async (req: IRequest, res: Response) => {
    try {
        const { commentId } = req.params as { commentId: string };
        const comment = await commentService.updateComment(commentId, req.user!.id, req.body.content);
        res.status(200).json({ message: "Comment Updated", comment });
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

router.delete("/:commentId", authGuard, async (req: IRequest, res: Response) => {
    try {
        const { commentId } = req.params as { commentId: string };
        await commentService.softDeleteComment(commentId, req.user!.id);
        res.status(200).json({ message: "Comment Deleted" });
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

router.post("/:commentId/react", authGuard, async (req: IRequest, res: Response) => {
    try {
        const { commentId } = req.params as { commentId: string };
        const comment = await commentService.reactToComment(commentId, req.user!.id, req.body.type);
        res.status(200).json({ message: "Reaction Updated", comment });
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

export default router;