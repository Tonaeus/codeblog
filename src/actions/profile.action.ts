import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user.action";

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

const getUserPosts = async (userId: string) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        id: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            image: true,
          },
        },
      },
    });

    return { success: true, posts };
  }
  catch (error) {
    console.log("Error in getUserPosts", error);
    return { success: false };
  }
};

const getUserFollowers = async (userId: string) => {
  try {
    const userWithFollowers = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        followers: {
          select: {
            follower: true,
          }
        }
      }
    });

    const followers = userWithFollowers?.followers.map(f => f.follower) ?? [];

    return { success: true, followers };
  }
  catch (error) {
    console.log("Error in getUserFollowers", error);
    return { success: false };
  }
};

const getUserFollowing = async (userId: string) => {
  try {
    const userWithFollowing = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        following: {
          select: {
            following: true,
          }
        }
      }
    });

    const following = userWithFollowing?.following.map(f => f.following) ?? [];

    return { success: true, following };
  }
  catch (error) {
    console.log("Error in getUserFollowers", error);
    return { success: false };
  }
};

const isFollowing = async (userId: string) => {
  try {
    const currentUserId = await getDbUserId();

    if (!currentUserId) {
      return { success: false };
    }

    const follow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: userId,
        },
      },
    });

    return { success: false, isFollowing: !!follow};
  }
  catch (error) {
    console.log("Error in isFollowing", error);
    return { success: false };
  }
};

export {
  getProfile,
  getUserPosts,
  getUserFollowers,
  getUserFollowing,
  isFollowing,
};
