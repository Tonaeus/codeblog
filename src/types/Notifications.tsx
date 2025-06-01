import { getNotifications } from "@/actions/notification.action";

type Notification = NonNullable<
	Awaited<ReturnType<typeof getNotifications>>["notifications"]
>[number];

export type { Notification };
