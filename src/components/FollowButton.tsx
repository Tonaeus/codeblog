"use client";

import { Profile } from "@/types/Profile";
import { useState } from "react";
import { Button } from "./ui/button";

type FollowButtonProps = {
	profile: Profile;
	initialIsFollowing: boolean;
};

const FollowButton = ({
	profile, 
	initialIsFollowing,
}: FollowButtonProps) => {
	const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
	const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);

	const handleFollow = async () => {
		await fetch("/api/follows", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ targetUserId: profile?.id }),
		});
	};

	return (
		<Button
			onClick={handleFollow}
			disabled={isUpdatingFollow}
			variant={isFollowing ? "outline" : "default"}
		>
			{isFollowing ? "Unfollow" : "Follow"}
		</Button>
	);
};

export default FollowButton;
