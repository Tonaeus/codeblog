"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

const syncUser = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return;
    }

    if (!user.username) {
      throw new Error("Username is missing");
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: user.id
      }
    });

    if (existingUser) {
      return;
    }

    await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        username: user.username,
        image: user.imageUrl,
      }
    });

    return;
  }
  catch (error) {
    console.log("Error in syncUser:", error);
  }
}

export {
  syncUser
}