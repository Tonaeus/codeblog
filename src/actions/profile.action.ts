import { prisma } from "@/lib/prisma";

const getProfile = async (username: string) => {
  try {
    const profile = await prisma.user.findUnique({
      where: { username },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
      },
    });

    return { success: true, profile };
  }
  catch (error) {
    console.log("Error in getProfile", error);
    return { success: false };
  }
};

export {
  getProfile,
}