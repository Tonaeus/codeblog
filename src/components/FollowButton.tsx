"use client";

import { Profile } from "@/types/Profile";
import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2Icon, UserMinus2, UserPlus2 } from "lucide-react";

type FollowButtonProps = {
	profile: Profile;
	initialIsFollowing: boolean;
};

const FollowButton = ({ profile, initialIsFollowing }: FollowButtonProps) => {
	const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
	const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);

	const handleFollow = async () => {
		setIsUpdatingFollow(true);
		try {
			const response = await fetch("/api/follows", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ targetUserId: profile?.id }),
			});
			if (response.ok) {
				setIsFollowing(!isFollowing);
			} else {
				throw new Error();
			}
		} catch (error) {
			console.error(
				`Failed to ${isFollowing ? "unfollowed" : "followed"} ${
					profile?.username
				}.`,
				error
			);
		} finally {
			setIsUpdatingFollow(false);
		}
	};

	return (
		<Button
			onClick={handleFollow}
			disabled={isUpdatingFollow}
			variant={isFollowing ? "outline" : "default"}
		>
			{isUpdatingFollow ? (
				<>
					<Loader2Icon className="animate-spin" />
					{isFollowing ? "Unfollowing" : "Following"}
				</>
			) : (
				<>
					{isFollowing ? <UserMinus2 /> : <UserPlus2 />}
					{isFollowing ? "Unfollow" : "Follow"}
				</>
			)}
		</Button>
	);
};

export default FollowButton;
