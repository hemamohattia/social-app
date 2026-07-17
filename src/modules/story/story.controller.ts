import { Router, type Request, type Response } from 'express';
import storyService from './story.service.js';
import { authGuard } from '../../middleware/auth.middleware.js';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", authGuard, upload.single('image'), async (req: Request, res: Response) => {
    try {
        const result = await storyService.createStory(req.body, (req as any).user.id, req.file);
        res.status(201).json({ message: "Story Created", result });
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

router.get("/", authGuard, async (req: Request, res: Response) => {
    try {
        const stories = await storyService.getActiveStories();
        res.status(200).json(stories);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

router.delete("/:id", authGuard, async (req: Request, res: Response) => {
    try {
        await storyService.deleteStory(req.params.id as string, (req as any).user.id);
        res.status(200).json({ message: "Story Deleted" });
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

export default router;