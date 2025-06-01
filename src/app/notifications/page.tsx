import type { Notification } from "@/types/Notifications";
import { getNotifications } from "@/actions/notification.action";
import NotificationCard from "@/components/NotificationCard";
import HorizontalDivider from "@/components/HorizontalDivider";

const NotificationsPage = async () => {
	const result = await getNotifications();
	const notifications = result.notifications ?? [];

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

export default NotificationsPage;
