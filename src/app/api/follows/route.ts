import { getDbUserId } from "@/actions/user.action";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const POST = async (req: NextRequest) => {
  try {
    const { targetUserId } = await req.json();

    const userId = await getDbUserId();

    if (!userId) {
      return NextResponse.json(null, { status: 401 });
    }

    if (userId === targetUserId) {
      return NextResponse.json(null, { status: 400 });
    }

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId
        }
      }
    });

    if (existingFollow) {
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetUserId
          }
        }
      });
    }
    else {
      await prisma.follows.create({
        data: {
          followerId: userId,
          followingId: targetUserId
        }
      });
    }

    return NextResponse.json(null, { status: 200 });
  }
  catch (error) {
    console.error("Error in POST /api/follows", error);
    return NextResponse.json(null, { status: 500 });
  }
}

export {
  POST
}