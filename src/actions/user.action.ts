"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

const syncUser = async () => {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      throw new Error("Unauthorized");
    }

    const user = await currentUser();

    if (!user) {
      return;
    }

    if (!user.username) {
      throw new Error("Username not found");
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId
      }
    });

    const userData = {
      email: user.emailAddresses[0].emailAddress,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.imageUrl,
    };

    if (existingUser) {
      await prisma.user.update({
        where: { clerkId },
        data: userData
      });
    } 
    else {
      await prisma.user.create({
        data: {
          clerkId,
          ...userData
        }
      });
    }

    return;
  }
  catch (error) {
    console.log("Error in syncUser:", error);
    return;
  }
}

const getDbUserId = async () => {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId
    },
    select: {
      id: true
    }
  });

  if (!user) {
    throw new Error("User not found");
  };

  return user.id;
}

const getUserId = async () => {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId
    },
    select: {
      id: true
    }
  });

  if (!user) {
    return null;
  };

  return user.id;
}

export {
  syncUser,
  getDbUserId,
  getUserId,
};
