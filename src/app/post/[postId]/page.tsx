import { getOpinion, getPost } from "@/actions/post.action";
import sanitizeHtml from "@/utils/sanitizeHtml";
import { notFound } from "next/navigation";
import OpinionButtons from "@/components/post/OpinionButtons";
import PostMetadata from "@/components/post/PostMetadata";
import { Opinion } from "@/types/Opinion";

const generateMetadata = async ({ params }: { params: { postId: string } }) => {
  const { postId } = await params;
	const postResult = await getPost(postId);

	if (!postResult?.success) {
		return;
	}

	const post = postResult.post;

	if (!post) {
		return;
	}

  return {
    title: `Codeblog | ${post.title}`,
    description: `${post.description}`
  }
};

const PostPage = async ({ params }: { params: { postId: string } }) => {
	const { postId } = await params;
	const postResult = await getPost(postId);

	if (!postResult?.success) {
		notFound();
	}
	
	const post = postResult.post;
	
	if (!post) {
		notFound();
	}

	const opinionResult = await getOpinion(post?.id ?? "");
	const opinion = opinionResult.opinion?.opinion ?? Opinion.Neutral;

	return (
		<div className="flex flex-col flex-1 w-full items-center">
			<div
				className="
          max-w-3xl w-full p-4 flex flex-col flex-1 
          whitespace-normal break-words hyphens-auto
        "
			>
				<PostMetadata post={post} />
				<div className="prose dark:prose-invert max-w-none mt-4">
					<h1>{post.title}</h1>
				</div>
				<div className="my-4" />
				<div
					className="prose dark:prose-invert max-w-none mb-8"
					dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.body ?? "") }}
				/>
				<div>
					<OpinionButtons post={post} initialOpinion={opinion}/>
				</div>
			</div>
		</div>
	);
};

export default PostPage;

export {
	generateMetadata
};
