"use server";

import { Opinion } from "@/types/Opinion";
import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";

const createPost = async (title: string, body: string) => {
  try {
    const userId = await getDbUserId();

    if (!userId) {
      return { success: false };
    };

    await prisma.post.create({
      data: {
        authorId: userId,
        title,
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
    const [postData, opinionSum] = await prisma.$transaction([
      prisma.post.findUnique({
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
      }),
      prisma.opinion.aggregate({
        where: { postId },
        _sum: {
          opinion: true,
        },
      }),
    ]);

    if (!postData) {
      return { success: false };
    };

    const post = {
      ...postData,
      opinionSum: opinionSum._sum.opinion,
    };

    return { success: true, post }
  }
  catch (error) {
    console.log("Error in getPost:", error);
    return { success: false };
  }
};

const editPost = async (postId: string, title: string, body: string) => {
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

const getOpinion = async (postId: string) => {
  try {
    const userId = await getDbUserId();

    if (!userId) {
      return { success: false };
    };

    const opinion = await prisma.opinion.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        }
      }
    });

    return { success: true, opinion };
  }
  catch (error) {
    console.log("Error in getOpinion", error);
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

const toggleOpinion = async (postId: string, inputOpinion: Opinion) => {
  try {
    const userId = await getDbUserId();

    if (!userId) {
      return { success: false };
    };

    const existingOpinion = await prisma.opinion.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    const post = await prisma.post.findUnique({
      where: {
        id: postId
      },
      select: {
        authorId: true
      },
    });

    if (!post) {
      return { success: false };
    };

    const upvoteNotification = post.authorId !== userId && inputOpinion === Opinion.Positive
      ? prisma.notification.upsert({
        where: {
          type_recipientId_senderId_postId: {
            type: "UPVOTE",
            recipientId: post.authorId,
            senderId: userId,
            postId,
          },
        },
        create: {
          type: "UPVOTE",
          recipientId: post.authorId,
          senderId: userId,
          postId,
        },
        update: {},
      })
      : null;

    if (!existingOpinion) {
      await prisma.$transaction([
        prisma.opinion.create({
          data: {
            userId,
            postId,
            opinion: inputOpinion
          },
        }),
        ...(upvoteNotification ? [upvoteNotification] : []),
      ]);
    }
    else if (existingOpinion.opinion === inputOpinion) {
      await prisma.opinion.delete({
        where: {
          userId_postId: {
            userId,
            postId
          }
        },
      });
    }
    else {
      await prisma.$transaction([
        prisma.opinion.update({
          where: {
            userId_postId: {
              userId,
              postId
            }
          },
          data: {
            opinion: inputOpinion
          },
        }),
        ...(upvoteNotification ? [upvoteNotification] : []),
      ]);
    }

    return { success: true };
  }
  catch (error) {
    console.log("Error in toggleOpinion", error);
    return { success: false };
  }
};

export {
  createPost,
  getPost,
  editPost,
  getEditPost,
  deletePost,
  getOpinion,
  toggleOpinion,
};