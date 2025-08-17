import CreatePostPageClient from './CreatePostPageClient';
import { Metadata } from 'next';

const metadata: Metadata = {
	title: "Codeblog | Create Post",
};

const CreatePostPageServer = () => {
	return (
		<CreatePostPageClient />
	)
}

export default CreatePostPageServer;

export {
	metadata
};
