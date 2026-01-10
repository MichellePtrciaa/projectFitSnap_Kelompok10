import type { ReactNode } from "react";

export interface User {
    _id: string
    username: string
}

export interface Progress {
    likes: any;
    username: ReactNode;
    _id: string;
    postId: string;
    userId: {
        _id: string;
        username: string;
    };
    description: string;
    imageUrl?: string;
    createdAt: string;
}

export interface Comment {
    _id: string
    userId: User
    progressId: string
    text: string
    createdAt: string
}

export interface PostModel {
    _id: string; 
    userId: User; 
    caption: string;
    imageUrl: string; 
    createdAt: string; 
    updatedAt: string; 
}