import { PostModel } from './post.model.js';
import { uploadFile } from '../../utils/s3.utils.js';

export class PostService {
    public createPost = async (data: any, authorId: string, file?: Express.Multer.File) => {
        if (file) data.image = await uploadFile(file, 'posts');
        return await PostModel.create({ ...data, author: authorId });
    }

    public getAllPosts = async (page = 1, limit = 10) => {
        const skip = (page - 1) * limit;
        return await PostModel.find().populate('author', 'userName email profileImage').sort({ createdAt: -1 }).skip(skip).limit(limit);
    }

    public getPostById = async (postId: string) => {
        const post = await PostModel.findById(postId).populate('author', 'userName email profileImage');
        if (!post) throw new Error("Post not found");
        return post;
    }

    public getNewsFeed = async (page = 1, limit = 10) => {
        const skip = (page - 1) * limit;
        return await PostModel.find().populate('author', 'userName email profileImage').sort({ createdAt: -1 }).skip(skip).limit(limit);
    }

    public getUserPosts = async (userId: string) => {
        return await PostModel.find({ author: userId }).populate('author', 'userName email profileImage').sort({ createdAt: -1 });
    }

    public updatePost = async (postId: string, userId: string, data: any, file?: Express.Multer.File) => {
        const post = await PostModel.findOne({ _id: postId, author: userId });
        if (!post) throw new Error("Post not found or unauthorized");
        if (file) data.image = await uploadFile(file, 'posts');
        return await PostModel.findByIdAndUpdate(postId, data, { new: true });
    }

    public softDeletePost = async (postId: string, userId: string) => {
        const post = await PostModel.findOne({ _id: postId, author: userId });
        if (!post) throw new Error("Post not found or unauthorized");
        return await PostModel.findByIdAndUpdate(postId, { isDeleted: true, deletedAt: new Date() });
    }

    public reactToPost = async (postId: string, userId: string, type: 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry' = 'like') => {
        const post = await PostModel.findById(postId);
        if (!post) throw new Error("Post not found");

        const existingIndex = post.reactions.findIndex((r: any) => r.user.toString() === userId);

        if (existingIndex > -1) {
            const reaction = post.reactions[existingIndex] as any;
            if (reaction.type === type) {
                post.reactions.splice(existingIndex, 1);
            } else {
                reaction.type = type;
            }
        } else {
            post.reactions.push({ user: userId, type } as any);
        }

        return await post.save();
    }
}

export default new PostService();