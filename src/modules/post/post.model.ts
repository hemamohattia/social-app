import { Schema, model, Types } from 'mongoose';

const reactionSchema = new Schema({
    user: { type: Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry'], default: 'like' }
}, { _id: false });

const postSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },
    author: { type: Types.ObjectId, ref: 'User', required: true },
    reactions: [reactionSchema],
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
}, { timestamps: true });

postSchema.pre(/^find/, function (this: any) {
    this.where({ isDeleted: false });
});

postSchema.pre("findOneAndDelete", { document: false, query: true }, async function () {
    const post = await this.model.findOne(this.getFilter());
    if (post) {
        const { CommentModel } = await import('../comment/comment.model.js');
        await CommentModel.updateMany({ post: post._id }, { isDeleted: true, deletedAt: new Date() });
    }
});

export const PostModel = model('Post', postSchema);