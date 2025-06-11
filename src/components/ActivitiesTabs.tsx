import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Follower, Following, Post } from "@/types/Profile";
import PostCard from "./PostCard";
import HorizontalDivider from "./HorizontalDivider";

type ActivitiesTabsProps = {
	posts: Post[];
	followers: Follower[];
	following: Following[];
};

const PostTab = ({ posts }: { posts: Post[] }) => {
	console.log("posts", posts);
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
	return <div>Folowers</div>;
};

const FollowingTab = ({ following }: { following: Following[] }) => {
	return <div>Following</div>;
};

const ActivitiesTabs = ({
	posts,
	followers,
	following,
}: ActivitiesTabsProps) => {
	return (
		<Tabs defaultValue="posts" className="bg-red-400">
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
				<FollowingTab following={following} />
			</TabsContent>
		</Tabs>
	);
};

export default ActivitiesTabs;
