import { Pencil } from "lucide-react";
import CircularButton from "./ui/CircularButton";
import { Avatar, AvatarImage } from "./ui/avatar";
import { format, formatDistanceToNowStrict } from "date-fns";
import DeletePostButton from "./DeletePostButton";
import { Post } from "@/types/Post";
import LinkClient from "./LinkClient";
import { getUserId } from "@/actions/user.action";

const PostMetadata = async ({ post }: { post: Post }) => {
	const userId = await getUserId();

	if (!post) {
		return null;
	}

	return (
		<div className="flex flex-row justify-between w-full">
			<div className="flex flex-row items-center overflow-hidden">
				<LinkClient href={`/profile/${post.author?.username}`}>
					<Avatar>
						<AvatarImage src={post.author?.image ?? "/avatar.png"} />
					</Avatar>
				</LinkClient>
				<span className="m-1" />
				<div className="flex flex-col justify-center min-w-0">
					<b className="text-sm truncate leading-tight">
						<LinkClient
							href={`/profile/${post.author?.username}`}
							className="flex justify-start hover:text-primary"
						>
							{post.author?.name || post.author?.username}
						</LinkClient>
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
			{userId == post.authorId ? (
				<div className="flex flex-row">
					<span className="m-1" />
					<CircularButton variant="ghost" size="icon">
						<LinkClient href={`/edit-post/${post.id}`}>
							<Pencil />
						</LinkClient>
					</CircularButton>
					<DeletePostButton postId={post.id ?? ""} />
				</div>
			) : null}
		</div>
	);
};

export default PostMetadata;
