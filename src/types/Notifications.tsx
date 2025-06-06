import { getNotifications } from "@/actions/notification.";

type Notification = NonNullable<
	Awaited<ReturnType<typeof getNotifications>>["notifications"]
>[number];

export type { Notification };
