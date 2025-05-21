import { getPost } from "@/actions/post.action";
import sanitizeHtml from "@/utils/sanitizeHtml";
import { notFound } from "next/navigation";
import OpinionButtons from "@/components/OpinionButtons";
import PostMetadata from "@/components/PostMetadata";

const PostPage = async ({ params }: { params: { postId: string } }) => {
	const { postId } = await params;
	const result = await getPost(postId);

	if (!result?.success) {
		notFound();
	}

	const post = result.post;

	if (!post) {
		notFound();
	}

	return (
		<div className="flex flex-col flex-1 w-full items-center">
			<div
				className="
          max-w-3xl w-full p-4 flex flex-col flex-1 
          whitespace-normal break-words hyphens-auto
        "
			>
				<div className="prose dark:prose-invert max-w-none mb-4">
					<h1>{post.title}</h1>
				</div>
				<PostMetadata post={post} />
				<div className="my-4" />
				<div
					className="prose dark:prose-invert max-w-none mb-8"
					dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.body ?? "") }}
				/>
				<div>
					<OpinionButtons post={post} />
				</div>
			</div>
		</div>
	);
};

export default PostPage;
