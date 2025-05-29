import { Post } from "@/types/Post";
import PostMetadata from "./PostMetadata";
import OpinionButtons from "./OpinionButtons";
import Link from "next/link";
import StopPropagationWrapper from "./StopPropagationWrapper";

const PostCard = async ({ post }: { post: Post }) => {
	return (
		<Link
			href={`/post/${post?.id}`}
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
					<h1 className="line-clamp-3">{post?.title}</h1>
				</div>
				<div className="prose-sm dark:prose-invert whitespace-normal break-words hyphens-auto text-left">
					<p className="line-clamp-6">{post?.description}</p>
				</div>
			</div>
			<StopPropagationWrapper>
				<OpinionButtons post={post} />
			</StopPropagationWrapper>
		</Link>
	);
};

export default PostCard;
