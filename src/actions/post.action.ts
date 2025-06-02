"use server";

import { Opinion } from "@/types/Opinion";
import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";

const createPost = async (title: string, description: string, body: string) => {
  try {
    const userId = await getDbUserId();

    if (!userId) {
      return { success: false };
    };

    await prisma.post.create({
      data: {
        authorId: userId,
        title,
        description,
        body,
      }
    });

    revalidatePath("/");
    return { success: true };
  }
  catch (error) {
    console.log("Error in createPost:", error);
    return { success: false };
  }
};

const getPost = async (postId: string) => {
  try {
    const postData = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
      },
    });

    const opinionData = await prisma.opinion.aggregate({
      where: { postId },
      _sum: {
        opinion: true,
      },
    });

    if (!postData || !opinionData) {
      return { success: false };
    };

    const post = {
      ...postData,
      opinionSum: opinionData._sum.opinion,
    };

    return { success: true, post }
  }
  catch (error) {
    console.log("Error in getPost", error);
    return { success: false };
  }
};

const getPosts = async (limit: number = 15) => {
  try {
    const total = await prisma.post.count();

    if (total === 0) {
      return { success: true, posts: [] };
    }

    const newCount = Math.ceil(limit * 0.8);
    const oldCount = limit - newCount;

    const newPosts = await prisma.post.findMany({
      take: newCount,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
      },
    });

    const latestIds = new Set(newPosts.map(p => p.id));

    const oldPosts = await prisma.post.findMany({
      where: {
        id: { notIn: Array.from(latestIds) },
      },
      select: { id: true },
    });

    const shuffled = oldPosts.sort(() => 0.5 - Math.random());
    const randomOldIds = shuffled.slice(0, oldCount).map(p => p.id);

    const randomOldPosts = await prisma.post.findMany({
      where: {
        id: { in: randomOldIds },
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
      },
    });

    const allPosts = [...newPosts, ...randomOldPosts];
    
    const opinionResult = await prisma.opinion.groupBy({
      by: ['postId'],
      _sum: { 
        opinion: true
      },
      where: {
        postId: { 
          in: allPosts.map(p => p.id) 
        },
      },
    });
    
    const opinionMap = new Map(opinionResult.map(o => [o.postId, o._sum.opinion ?? 0]));

    const posts = allPosts.map(p => ({
      ...p,
      opinionSum: opinionMap.get(p.id) ?? 0,
    }));

    return { success: true, posts };
  } 
  catch (error) {
    console.error("Error in getPosts", error);
    return { success: false };
  }
};

const editPost = async (postId: string, title: string, description: string, body: string) => {
  try {
    const userId = await getDbUserId();

    if (!userId) {
      return { success: false };
    }

    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost || existingPost.authorId !== userId) {
      return { success: false };
    }

    await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        description,
        body,
      },
    });

    revalidatePath("/");
    revalidatePath(`/post/${postId}`);
    return { success: true };
  }
  catch (error) {
    console.log("Error in editPost:", error);
    return { success: false };
  }
};

const getEditPost = async (postId: string) => {
  try {
    const userId = await getDbUserId();

    if (!userId) {
      return { success: false };
    };

    const post = await prisma.post.findUnique({
      where: {
        authorId: userId,
        id: postId,
      }
    })

    return { success: true, post };
  }
  catch (error) {
    console.log("Error in getEditPost", error);
    return { success: false };
  }
};

const deletePost = async (postId: string) => {
  try {
    const userId = await getDbUserId();

    if (!userId) {
      return { success: false };
    }

    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost || existingPost.authorId !== userId) {
      return { success: false };
    }

    await prisma.post.delete({
      where: {
        id: postId,
        authorId: userId
      }
    });

    revalidatePath("/");
    revalidatePath(`/post/${postId}`);
    return { success: true };
  }
  catch (error) {
    console.log("Error in deletePost", error);
    return { success: false };
  }
};

export {
  createPost,
  getPost,
  getPosts,
  editPost,
  getEditPost,
  deletePost,
};