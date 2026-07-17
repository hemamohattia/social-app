import { CommentModel } from './comment.model.js';

type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';

export class CommentService {
    public createComment = async (content: string, authorId: string, postId: string) => {
        return await CommentModel.create({ content, author: authorId, post: postId });
    };

    public createReply = async (content: string, authorId: string, postId: string, parentCommentId: string) => {
        return await CommentModel.create({ content, author: authorId, post: postId, parentComment: parentCommentId });
    };

    public getPostComments = async (postId: string) => {
        return await CommentModel.find({ post: postId, parentComment: null }).populate('author', 'userName email profileImage');
    };

    public updateComment = async (commentId: string, userId: string, content: string) => {
        const comment = await CommentModel.findOne({ _id: commentId, author: userId });
        if (!comment) throw new Error('Comment not found or unauthorized');
        return await CommentModel.findByIdAndUpdate(commentId, { content }, { new: true });
    };

    public softDeleteComment = async (commentId: string, userId: string) => {
        const comment = await CommentModel.findOne({ _id: commentId, author: userId });
        if (!comment) throw new Error('Comment not found or unauthorized');
        await CommentModel.updateMany({ parentComment: commentId }, { isDeleted: true, deletedAt: new Date() });
        return await CommentModel.findByIdAndUpdate(commentId, { isDeleted: true, deletedAt: new Date() });
    };

    public reactToComment = async (commentId: string, userId: string, type: ReactionType = 'like') => {
    const comment = await CommentModel.findById(commentId);
    if (!comment) throw new Error('Comment not found');

    const reactions = comment.reactions as Array<{ user: any; type: ReactionType }>;
    const existingIndex = reactions.findIndex((r) => r.user.toString() === userId);

    if (existingIndex > -1) {
        const existing = reactions[existingIndex];
        if (existing && existing.type === type) {
            comment.reactions.splice(existingIndex, 1);
        } else if (existing) {
            (comment.reactions[existingIndex] as any).type = type;
        }
    } else {
        comment.reactions.push({ user: userId, type } as any);
    }

    return await comment.save();
};
}

export default new CommentService();