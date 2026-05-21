import { useState, useEffect } from "react";

export type PostStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Post {
  id: string;
  name: string;
  title: string;
  description: string;
  imageUrl?: string;
  status: PostStatus;
  createdAt: number;
}

const STORAGE_KEY = "ifoxblog_posts";

const getInitialPosts = (): Post[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return [
    {
      id: "1",
      name: "John Doe",
      title: "Welcome to the new platform",
      description:
        "This is the first approved post on our new platform. It features a great design and responsive layout.",
      imageUrl:
        "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=800",
      status: "APPROVED",
      createdAt: Date.now() - 100000,
    },
    {
      id: "2",
      name: "Jane Smith",
      title: "Pending Review Example",
      description:
        "This post is waiting for admin approval. It should not appear on the homepage yet.",
      imageUrl:
        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800",
      status: "PENDING",
      createdAt: Date.now() - 50000,
    },
  ];
};

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>(getInitialPosts);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  const addPost = (post: Omit<Post, "id" | "status" | "createdAt">) => {
    const newPost: Post = {
      ...post,
      id: Math.random().toString(36).substring(2, 9),
      status: "PENDING",
      createdAt: Date.now(),
    };
    setPosts((prev) => [newPost, ...prev]);
    return newPost;
  };

  const updatePostStatus = (id: string, status: PostStatus) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  const deletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return {
    posts,
    addPost,
    updatePostStatus,
    deletePost,
    approvedPosts: posts
      .filter((p) => p.status === "APPROVED")
      .sort((a, b) => b.createdAt - a.createdAt),
    pendingPosts: posts
      .filter((p) => p.status === "PENDING")
      .sort((a, b) => a.createdAt - b.createdAt),
  };
};
