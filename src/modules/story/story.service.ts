import { StoryModel } from './story.model.js';
import { uploadFile } from '../../utils/s3.utils.js';

export class StoryService {
    public createStory = async (data: any, authorId: string, file?: Express.Multer.File) => {
        if (file) data.image = await uploadFile(file, 'stories');
        return await StoryModel.create({ ...data, author: authorId });
    }

    public getActiveStories = async () => {
        return await StoryModel.find({
            isDeleted: false,
            expiresAt: { $gt: new Date() }
        }).populate('author', 'userName email profileImage').sort({ createdAt: -1 });
    }

    public deleteStory = async (storyId: string, userId: string) => {
        const story = await StoryModel.findOne({ _id: storyId, author: userId });
        if (!story) throw new Error("Story not found or unauthorized");
        return await StoryModel.findByIdAndUpdate(storyId, { isDeleted: true });
    }
}

export default new StoryService();