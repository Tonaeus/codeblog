import { User } from "@/types/Profile";
import Link from "next/link";
import { Avatar, AvatarImage } from "../ui/avatar";
import FollowButton from "./FollowButton";
import { getProfile, isFollowing } from "@/actions/profile.action";
import { getUserId } from "@/actions/user.action";

const UserCard = async ({ user }: { user: User }) => {
	const profileResult = await getProfile(user.username);
	const profile = profileResult.profile;
	const initialIsFollowingResult = await isFollowing(user.id);
	const initialIsFollowing = initialIsFollowingResult.isFollowing;
	const userId = await getUserId();

	return (
		<div
			className="
				group
				flex flex-row justify-between w-full h-14
				px-4 py-2 gap-2
				rounded-md
				transition-all hover:bg-accent dark:hover:bg-accent/50
			"
		>
			<div className="flex flex-row justify-start items-center gap-2 overflow-hidden">
				<Link href={`/profile/${user.username}`}>
					<Avatar>
						<AvatarImage src={user.image ?? "/avatar.png"} />
					</Avatar>
				</Link>
				<div className="h-full flex flex-col justify-center overflow-hidden">
					<div className="w-full min-w-0 flex">
						<p className="leading-tight truncate">
							<Link
								href={`/profile/${user.username}`}
								className="text-sm inline hover:text-primary"
							>
								<b>{user.username}</b>
							</Link>
						</p>
					</div>
				</div>
			</div>
			{userId && profile?.id !== userId ? (
				<FollowButton
					profile={profile}
					initialIsFollowing={initialIsFollowing ?? false}
				/>
			) : null}
		</div>
	);
};

export default UserCard;
