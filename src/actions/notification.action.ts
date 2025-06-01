import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user.action";

const getNotifications = async () => {
  try {
    const userId = await getDbUserId();

    if (!userId) {
      return { success: false };
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
            name: true,
            image: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
          }
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, notifications };
  }
  catch (error) {
    console.error("Error in getNotifications", error);
    return { success: false };
  }
};

export {
  getNotifications,
}