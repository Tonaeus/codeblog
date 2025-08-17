import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Follower, Following, Post } from "@/types/Profile";
import PostCard from "../post/PostCard";
import HorizontalDivider from "../ui/HorizontalDivider";
import UserCard from "./UserCard";

type ActivitiesTabsProps = {
	posts: Post[];
	followers: Follower[];
	following: Following[];
};

const PostTab = ({ posts }: { posts: Post[] }) => {
	return (
		<>
			{posts?.map((post: Post, index: number) => (
				<div key={post?.id}>
					<PostCard post={post} />
					{index < posts.length - 1 && <HorizontalDivider />}
				</div>
			))}
		</>
	);
};

const FollowersTab = ({ followers }: { followers: Follower[] }) => {
	return (
		<>
			{followers?.map((follower: Follower, index: number) => (
				<div key={follower?.id}>
					<UserCard user={follower} />
					{index < followers.length - 1 && <HorizontalDivider />}
				</div>
			))}
		</>
	);
};

const FollowingTab = ({ followings }: { followings: Following[] }) => {
	return (
		<>
			{followings?.map((following: Follower, index: number) => (
				<div key={following?.id}>
					<UserCard user={following} />
					{index < followings.length - 1 && <HorizontalDivider />}
				</div>
			))}
		</>
	);
};

const ActivitiesTabs = ({
	posts,
	followers,
	following,
}: ActivitiesTabsProps) => {
	return (
		<Tabs defaultValue="posts">
			<TabsList className="w-full">
				<TabsTrigger value="posts">Posts</TabsTrigger>
				<TabsTrigger value="followers">Followers</TabsTrigger>
				<TabsTrigger value="following">Following</TabsTrigger>
			</TabsList>
			<TabsContent value="posts">
				<PostTab posts={posts} />
			</TabsContent>
			<TabsContent value="followers">
				<FollowersTab followers={followers} />
			</TabsContent>
			<TabsContent value="following">
				<FollowingTab followings={following} />
			</TabsContent>
		</Tabs>
	);
};

export default ActivitiesTabs;
