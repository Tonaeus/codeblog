import { Post } from "@/types/Post";
import PostMetadata from "./PostMetadata";
import OpinionButtons from "./OpinionButtons";
import Link from "next/link";
import { Button } from "./ui/button";

const PostCard = async ({ post }: { post: Post }) => {
	return (
		<Link href={`/post/${post?.id}`} className="group">
			<Button
				variant="ghost"
				className="flex flex-col w-full h-auto items-start"
			>
				<PostMetadata post={post} />
				<div className="space-y-2 flex flex-col items-start w-full">
					<div className="prose-sm dark:prose-invert whitespace-normal break-words hyphens-auto text-left">
						<h1 className="line-clamp-3">{post?.title}</h1>
					</div>
					<div className="prose-sm dark:prose-invert whitespace-normal break-words hyphens-auto text-left">
						<p className="line-clamp-6">{post?.description}</p>
					</div>
				</div>
				<OpinionButtons post={post} />
			</Button>
		</Link>
	);
};

export default PostCard;
