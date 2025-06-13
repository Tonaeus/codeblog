import { getDbUserId } from "@/actions/user.action";
import { prisma } from "@/lib/prisma";
import { Opinion } from "@/types/Opinion";
import { NextRequest, NextResponse } from "next/server";

const POST = async (req: NextRequest) => {
  try {
    const userId = await getDbUserId();

    if (!userId) {
      return NextResponse.json(null, { status: 401 });
    }

    const body = await req.json();
    const { postId, opinion } = body;

    if (!postId || !opinion || !Object.values(Opinion).includes(opinion as Opinion)) {
      return NextResponse.json(null, { status: 400 });
    }

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
      return NextResponse.json(null, { status: 404 });
    }

    const upvoteNotification = post.authorId !== userId && opinion === Opinion.Positive
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
            opinion,
          },
        }),
        ...(upvoteNotification ? [upvoteNotification] : []),
      ]);
    }
    else if (existingOpinion.opinion === opinion) {
      await prisma.opinion.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
    }
    else {
      await prisma.$transaction([
        prisma.opinion.update({
          where: {
            userId_postId: {
              userId,
              postId,
            },
          },
          data: {
            opinion,
          },
        }),
        ...(upvoteNotification ? [upvoteNotification] : []),
      ]);
    }

    return NextResponse.json(null, { status: 200 });
  }
  catch (error) {
    console.error("Error in POST /api/opinions", error);
    return NextResponse.json(null, { status: 500 });
  }
}

export {
  POST,
}
