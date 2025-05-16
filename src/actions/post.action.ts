"use server";

import { Opinion } from "@/types/Opinion";
import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";

const createPost = async (title: string, body: string) => {
  try {
    const userId = await getDbUserId();

    if (!userId) {
      return;
    };

    const post = await prisma.post.create({
      data: {
        authorId: userId,
        title,
        body,
      }
    });

    revalidatePath("/");
    return { success: true, post };
  }
  catch (error) {
    console.log("Error in createPost:", error);
    return { success: false, error: "Error in createPost" };
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
      ...postData?.author,
      opinion: opinionSum._sum.opinion ?? 0,
    };
    delete post.author;

    return { success: true, post }
  }
  catch (error) {
    console.log("Error in getPost:", error);
    return { success: false, error: "Error in getPost" };
  }
};

const getOpinion = (postId: string) => {

};

const updateOpinion = async (postId: string, opinion: Opinion) => {
  try {
    const userId = await getDbUserId();

    if (!userId) {
      return;
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
      throw new Error("Post not found");
    };

    if (!existingOpinion) {
      await prisma.$transaction([
        prisma.opinion.create({
          data: {
            userId,
            postId,
            opinion,
          }
        }),
        ...(post.authorId !== userId && opinion === Opinion.Positive
          ? [
              prisma.notification.create({
                data: {
                  type: "UPVOTE",
                  recipientId: post.authorId,
                  senderId: userId,
                  postId,
                },
              }),
            ]
          : []),
      ]);
    }
    else if (opinion === existingOpinion.opinion) {
      await prisma.opinion.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
    }

    // revalidatePath("/"); // there are 2 possible paths
    return { success: true };
  }
  catch (error) {
    console.log("Error in toggleOpinion", error);
    return { success: false, error: "Error in toggleOpinion" };
  }
};

export {
  createPost,
  getPost,
  getOpinion,
  updateOpinion,
};