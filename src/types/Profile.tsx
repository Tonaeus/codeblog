import {
	getProfile,
	getUserFollowers,
	getUserFollowing,
	getUserPosts,
} from "@/actions/profile.action";

type Profile = Awaited<ReturnType<typeof getProfile>>["profile"];

type Post = NonNullable<
	Awaited<ReturnType<typeof getUserPosts>>["posts"]
>[number];

type Follower = NonNullable<
	Awaited<ReturnType<typeof getUserFollowers>>["followers"]
>[number];

type Following = NonNullable<
	Awaited<ReturnType<typeof getUserFollowing>>["following"]
>[number];

type User = Follower | Following;

export type { Profile, Post, Follower, Following, User };
