import { Post } from "@/types/Post";
import PostMetadata from "./PostMetadata";
import OpinionButtons from "./OpinionButtons";

const PostCard = async ({ post }: { post: Post }) => {
	return (
		<div className="px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 group">
			<PostMetadata post={post} />
			<div className="py-2 flex flex-col items-start">
				<div className="prose-sm dark:prose-invert whitespace-normal break-words hyphens-auto">
					<h1 className="line-clamp-3">{post?.title}</h1>
				</div>
				<div className="prose-sm dark:prose-invert whitespace-normal break-words hyphens-auto">
					<p className="line-clamp-6">{post?.description}</p>
				</div>
			</div>
			<OpinionButtons post={post} />
		</div>
	);
};

export default PostCard;
