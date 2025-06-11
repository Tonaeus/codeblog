import {
	getProfile,
	getUserFollowers,
	getUserFollowing,
	getUserPosts,
	isFollowing,
} from "@/actions/profile.action";
import { getDbUserId } from "@/actions/user.action";
import ActivitiesTabs from "@/components/ActivitiesTabs";
import FollowButton from "@/components/FollowButton";
import ProfileCard from "@/components/ProfileCard";
import { notFound } from "next/navigation";
import React from "react";

const profilePage = async ({ params }: { params: { username: string } }) => {
	const { username } = await params;
	const result = await getProfile(username);

	if (!result?.success || !result.profile) {
		notFound();
	}

	const profile = result.profile!;

	const userId = await getDbUserId();

	const [
		initialIsFollowingResult,
		postsResult,
		followersResult,
		followingResult,
	] = await Promise.all([
		isFollowing(profile.id),
		getUserPosts(profile.id),
		getUserFollowers(profile.id),
		getUserFollowing(profile.id),
	]);

	const posts = postsResult?.success ? postsResult.posts : [];
	const followers = followersResult?.success ? followersResult.followers : [];
	const following = followingResult?.success ? followingResult.following : [];
	const initialIsFollowing = initialIsFollowingResult?.success
		? initialIsFollowingResult.isFollowing
		: false;

	return (
		<div className="flex flex-col flex-1 w-full items-center bg-blue-300">
			<div className="max-w-3xl w-full p-4 flex flex-col flex-1 bg-orange-300">
				<ProfileCard profile={profile} />
				{profile.id !== userId ? (
					<FollowButton
						profile={profile}
						initialIsFollowing={initialIsFollowing ?? false}
					/>
				) : null}
				<ActivitiesTabs
					posts={posts ?? []}
					followers={followers ?? []}
					following={following ?? []}
				/>
			</div>
		</div>
	);
};

export default profilePage;
