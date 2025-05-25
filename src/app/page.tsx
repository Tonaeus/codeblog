import { getPosts } from "@/actions/post.action";
import HorizontalDivider from "@/components/HorizontalDivider";
import PostCard from "@/components/PostCard";
import { Post } from "@/types/Post";

const page = async () => {
	const result = await getPosts();
	const posts = result.posts ?? [];

	return (
		<div className="flex flex-col flex-1 w-full items-center">
			<div className="flex flex-col max-w-3xl w-full p-4">
				{posts.map((post: Post, index: number) => (
					<div key={post?.id}>
						<PostCard post={post} />
						{index < posts.length - 1 && <HorizontalDivider />}
					</div>
				))}
			</div>
		</div>
	);
};

export default page;
