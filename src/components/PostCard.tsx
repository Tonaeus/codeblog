import { Post } from "@/types/Post";
import PostMetadata from "./PostMetadata";
import OpinionButtons from "./OpinionButtons";
import Link from "next/link";

const PostCard = async ({ post }: { post: Post }) => {
	return (
		<div
			className="
				group
				flex flex-col justify-center items-start w-full h-auto
				px-4 py-2 gap-2
				rounded-md
				transition-all hover:bg-accent dark:hover:bg-accent/50
			"
		>
			<PostMetadata
				post={post}
				btnClassName="hover:bg-aa-btn dark:hover:bg-aa-btn"
			/>
			<div className="space-y-2 flex flex-col items-start w-full">
				<div className="prose-sm dark:prose-invert whitespace-normal break-words hyphens-auto text-left">
					<Link href={`/post/${post?.id}`} className="hover:text-primary">
						<h1 className="line-clamp-3">{post?.title}</h1>
					</Link>
				</div>
				<div className="prose-sm dark:prose-invert whitespace-normal break-words hyphens-auto text-left">
					<p className="line-clamp-6">{post?.description}</p>
				</div>
			</div>
			<OpinionButtons post={post} />
		</div>
	);
};

export default PostCard;
