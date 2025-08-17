import { getEditPost } from "@/actions/post.action";
import EditPostPageClient from "./EditPostPageClient";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";

const metadata: Metadata = {
	title: "Codeblog | Edit Post",
};

const EditPostPageServer = async ({ params }: { params: { postId: string } }) => {
	const { userId, redirectToSignIn } = await auth();
	if (!userId) {
		redirectToSignIn();
	}
	
	const { postId } = params;
	const result = await getEditPost(postId);
	if (!result?.success) {
		notFound();
	}
	
	return (
		<EditPostPageClient post={result.post} />
	)
}

export default EditPostPageServer;

export {
	metadata
};