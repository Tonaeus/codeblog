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

    revalidatePath("/");
    revalidatePath(`/post/${postId}`);
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
  getOpinion,
  toggleOpinion,
};