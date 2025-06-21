import {
	getProfile,
	getUserFollowers,
	getUserFollowing,
	getUserPosts,
	isFollowing,
} from "@/actions/profile.action";
import { getUserId } from "@/actions/user.action";
import ActivitiesTabs from "@/components/profile/ActivitiesTabs";
import FollowButton from "@/components/profile/FollowButton";
import ProfileCard from "@/components/profile/ProfileCard";
import { notFound } from "next/navigation";
import React from "react";

const generateMetadata = async ({ params }: { params: { username: string } }) => {
  return {
    title: `Codeblog | ${params.username}`,
    description: `Check out ${params.username}'s profile`
  }
};

const profilePage = async ({ params }: { params: { username: string } }) => {
	const { username } = await params;
	const result = await getProfile(username);

	if (!result?.success || !result.profile) {
		notFound();
	}

	const profile = result.profile!;

	const userId = await getUserId();

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
		<div className="flex flex-col flex-1 w-full items-center">
			<div className="max-w-3xl w-full p-4 flex flex-col flex-1 gap-2">
				<ProfileCard profile={profile} />
				{userId && profile.id !== userId ? (
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

export {
  generateMetadata
};
