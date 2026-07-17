import { gql } from 'graphql-tag';

export const typeDefs = gql`
    type User {
        id: ID!
        userName: String!
        email: String!
        profileImage: String
        role: String!
    }

    type Post {
        id: ID!
        title: String!
        content: String!
        image: String
        author: User!
        createdAt: String!
    }

    type Comment {
        id: ID!
        content: String!
        author: User!
        post: ID!
        createdAt: String!
    }

    type AuthPayload {
        accessToken: String!
        refreshToken: String!
    }

    type Query {
        me: User
        getAllPosts(page: Int, limit: Int): [Post]
        getPost(id: ID!): Post
        getPostComments(postId: ID!): [Comment]
        getUserPosts: [Post]
    }

    type Mutation {
        register(userName: String!, email: String!, password: String!, age: Int, gender: String): User
        login(email: String!, password: String!): AuthPayload
        createPost(title: String!, content: String!): Post
        updatePost(id: ID!, title: String, content: String): Post
        deletePost(id: ID!): Boolean
        reactToPost(postId: ID!, type: String): Post
        createComment(postId: ID!, content: String!): Comment
        deleteComment(commentId: ID!): Boolean
    }
`;