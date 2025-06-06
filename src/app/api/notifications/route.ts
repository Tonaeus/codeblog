import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDbUserId } from "@/actions/user.action";

const GET = async () => {
  try {
    const userId = await getDbUserId();

    if (!userId) {
      return NextResponse.json(null, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: userId,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            image: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ notifications }, { status: 200 });
  }
  catch (error) {
    console.error("Error in GET /api/notifications", error);
    return NextResponse.json(null, { status: 500 });
  }
};

const PATCH = async (request: NextRequest) => {
  try {
    const userId = await getDbUserId();

    if (!userId) {
      return NextResponse.json(null, { status: 401 });
    }

    const body = await request.json();
    const notificationIds: string[] = body.notificationIds;

    await prisma.notification.updateMany({
      where: {
        id: {
          in: notificationIds,
        },
      },
      data: {
        read: true,
      },
    });

    return NextResponse.json(null, { status: 200 });
  }
  catch (error) {
    console.error("Error in PATCH /api/notifications", error);
    return NextResponse.json(null, { status: 500 });
  }
};

export {
  GET,
  PATCH
}
