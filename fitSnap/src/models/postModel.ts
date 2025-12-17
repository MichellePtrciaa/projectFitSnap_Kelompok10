export interface User {
    _id: string
    username: string
}

export interface Progress {
    _id: string
    userId: User
    description: string
    imageUrl?: string
    likes: number
    createdAt: string
}

export interface Comment {
    _id: string
    userId: User
    progressId: string
    text: string
    createdAt: string
}
