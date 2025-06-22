import { getPosts } from "@/actions/post.action";
import HorizontalDivider from "@/components/ui/HorizontalDivider";
import PostCard from "@/components/post/PostCard";
import { Post } from "@/types/Post";
import { Metadata } from "next";

// const metadata: Metadata = {
// 	title: "Codeblog | Home",
// 	description: "Explore blog posts on software development topics."
// };

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

// export {
// 	metadata
// }
