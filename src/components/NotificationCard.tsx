import type { Notification } from "@/types/Notifications";
import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "./ui/avatar";
import { formatDistanceToNowStrict } from "date-fns/formatDistanceToNowStrict";
import { format } from "date-fns";
import Link from "next/link";

const NotificationCard = ({ notification }: { notification: Notification }) => {
	return (
		<Button variant="ghost" className="flex flex-row w-full px-4 py-2 h-14">
			<Link href={`/profile/${notification.sender.username}`}>
				<Avatar>
					<AvatarImage src={notification.sender.image ?? "/avatar.png"} />
				</Avatar>
			</Link>
			<div className="h-full flex flex-col justify-center overflow-hidden">
				<div className="w-full min-w-0 flex">
					<p className="text-sm leading-tight truncate">
						<Link
							href={`/profile/${notification.sender.username}`}
							className="inline hover:text-primary"
						>
							<b>
								{`${notification.sender.firstName} ${notification.sender.lastName}` ||
									notification.sender.username}
							</b>
						</Link>
						<span className="inline"> liked your </span>
						<Link
							href={`/post/${notification.post?.id}`}
							className="inline hover:text-primary"
						>
							<b>post</b>
						</Link>
					</p>
				</div>
				<div className="w-full min-w-0 flex">
					<div className="text-xs truncate leading-tight">
						{notification.createdAt
							? new Date().getTime() -
									new Date(notification.createdAt).getTime() <
							  7 * 24 * 60 * 60 * 1000
								? formatDistanceToNowStrict(new Date(notification.createdAt)) +
								  " ago"
								: format(new Date(notification.createdAt), "MMM d, yyyy")
							: ""}
					</div>
				</div>
			</div>
			<div className="h-full flex-1 -ml-2" />
			<div className="flex flex-shrink-0 justify-center items-center h-full w-4">
				{!notification.read ? (
					<div className="bg-primary rounded-full h-2 w-2" />
				) : null}
			</div>
		</Button>
	);
};

export default NotificationCard;
