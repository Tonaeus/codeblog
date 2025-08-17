"use client";

import type { Notification } from "@/types/Notifications";
import NotificationCard from "@/components/notif/NotificationCard";
import HorizontalDivider from "@/components/ui/HorizontalDivider";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const NotificationsPageClient = () => {
	const [notifications, setNotifications] = useState<Notification[]>([]);

	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				const response = await fetch("/api/notifications");
				const json = await response.json();

				if (!response.ok) {
					throw new Error();
				}

				const notifications = json.notifications;

				setNotifications(notifications);

				const unreadIds = notifications
					.filter((n: Notification) => !n.read)
					.map((n: Notification) => n.id);

				if (unreadIds.length > 0) {
					await fetch("/api/notifications", {
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ unreadIds }),
					});
				}
			} catch (error) {
				toast.error("Failed to fetch notifications.", {
					position: "top-center",
					richColors: true,
				});
			}
		};

		fetchNotifications();
	}, []);

	return (
		<div className="flex flex-col flex-1 w-full items-center">
			<div className="flex flex-col max-w-3xl w-full p-4">
				{notifications.map((notification: Notification, index: number) => (
					<div key={notification?.id}>
						<NotificationCard notification={notification} />
						{index < notifications.length - 1 && <HorizontalDivider />}
					</div>
				))}
			</div>
		</div>
	);
};

export default NotificationsPageClient;
