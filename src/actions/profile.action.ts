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
    const postData = await prisma.post.findMany({
      where: {
        authorId: userId,
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

    const opinionData = await prisma.opinion.groupBy({
      by: ['postId'],
      _sum: { 
        opinion: true
      },
      where: {
        postId: { 
          in: postData.map(p => p.id) 
        },
      },
    });

    const opinionMap = new Map(opinionData.map(o => [o.postId, o._sum.opinion ?? 0]));

    const posts = postData.map(p => ({
      ...p,
      opinionSum: opinionMap.get(p.id) ?? 0,
    }));

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
          orderBy: { createdAt: 'asc' },
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
          orderBy: { createdAt: 'asc' },
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

    return { success: true, isFollowing: !!follow};
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
