export interface User {
  _id: string
  username: string
  email?: string
}

export interface Progress {
  _id: string
  userId: User
  description: string
  imageUrl?: string
  likes: string[]       
  createdAt: string
  updatedAt?: string
}

export interface Comment {
  _id: string
  userId: User
  progressId: string
  text: string
  createdAt: string
}

export interface PostModel {
  _id: string
  userId: User          
  caption: string
  imageUrl: string
  createdAt: string
  updatedAt: string
}
