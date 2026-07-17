import authService from '../modules/auth/auth.service.js';
import postService from '../modules/post/post.service.js';
import commentService from '../modules/comment/comment.service.js';
import userService from '../modules/user/user.service.js';

export const resolvers = {
    Query: {
        me: async (_: any, __: any, context: any) => {
            if (!context.user) throw new Error('Unauthorized');
            return await userService.findUserById(context.user.id);
        },
        getAllPosts: async (_: any, { page, limit }: any) => {
            return await postService.getAllPosts(page || 1, limit || 10);
        },
        getPost: async (_: any, { id }: any) => {
            return await postService.getPostById(id);
        },
        getPostComments: async (_: any, { postId }: any) => {
            return await commentService.getPostComments(postId);
        },
        getUserPosts: async (_: any, __: any, context: any) => {
            if (!context.user) throw new Error('Unauthorized');
            return await postService.getUserPosts(context.user.id);
        }
    },
    Mutation: {
        register: async (_: any, args: any) => await authService.register(args),
        login: async (_: any, args: any) => await authService.login(args),
        createPost: async (_: any, args: any, context: any) => {
            if (!context.user) throw new Error('Unauthorized');
            return await postService.createPost(args, context.user.id);
        },
        updatePost: async (_: any, { id, ...data }: any, context: any) => {
            if (!context.user) throw new Error('Unauthorized');
            return await postService.updatePost(id, context.user.id, data);
        },
        deletePost: async (_: any, { id }: any, context: any) => {
            if (!context.user) throw new Error('Unauthorized');
            await postService.softDeletePost(id, context.user.id);
            return true;
        },
        reactToPost: async (_: any, { postId, type }: any, context: any) => {
            if (!context.user) throw new Error('Unauthorized');
            return await postService.reactToPost(postId, context.user.id, type);
        },
        createComment: async (_: any, { postId, content }: any, context: any) => {
            if (!context.user) throw new Error('Unauthorized');
            return await commentService.createComment(content, context.user.id, postId);
        },
        deleteComment: async (_: any, { commentId }: any, context: any) => {
            if (!context.user) throw new Error('Unauthorized');
            await commentService.softDeleteComment(commentId, context.user.id);
            return true;
        }
    }
};