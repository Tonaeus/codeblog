"use server";

import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";

const createPost = async (title: string, body: string) => {
  try {
    const userId = await getDbUserId();

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

export {
  createPost,
  getPost,
};