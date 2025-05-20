import { Pencil, Trash } from "lucide-react";
import CircularButton from "./ui/CircularButton";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { format, formatDistanceToNowStrict } from "date-fns";
import { getPost } from "@/actions/post.action";

type Post = Awaited<ReturnType<typeof getPost>>["post"];

const PostMetadata = ({ post }: { post: Post }) => {
	if (!post) {
		return null;
	}

	if (post?.author) {
		post.author.name = "John Smith"; // REMOVE THIS LINE
	}

	return (
		<div className="flex flex-row justify-between">
			<div className="flex flex-row items-center overflow-hidden">
				<Link href={`/profile/${post.author?.username}`}>
					<Avatar>
						<AvatarImage src={post.author?.image ?? "/avatar.png"} />
					</Avatar>
				</Link>
				<span className="m-1" />
				<div className="flex flex-col justify-center min-w-0">
					<b className="text-sm truncate leading-tight">
						<Link href={`/profile/${post.author?.username}`}>
							{post.author?.name}
						</Link>
					</b>
					<div className="text-xs truncate leading-tight">
						{post.createdAt
							? new Date().getTime() - new Date(post.createdAt).getTime() <
							  7 * 24 * 60 * 60 * 1000
								? formatDistanceToNowStrict(new Date(post.createdAt)) + " ago"
								: format(new Date(post.createdAt), "MMM d, yyyy")
							: ""}
					</div>
				</div>
			</div>
			<div className="flex flex-row">
				<span className="m-1" />
				<CircularButton variant="ghost" size="icon">
					<Link href={`/edit-post/${post.id}`}>
						<Pencil />
					</Link>
				</CircularButton>
				<CircularButton variant="ghost" size="icon">
					<Trash />
				</CircularButton>
			</div>
		</div>
	);
};

export default PostMetadata;
