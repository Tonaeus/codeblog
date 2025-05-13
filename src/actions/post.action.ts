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

export {
  createPost
};