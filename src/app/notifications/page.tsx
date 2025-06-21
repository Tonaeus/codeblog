import { auth } from '@clerk/nextjs/server';
import NotificationsPageClient from './NotificationsPageClient'
import { Metadata } from 'next';

const metadata: Metadata = {
	title: "Codeblog | Notifications",
};

const NotificationsPage = async () => {
	const { userId, redirectToSignIn } = await auth();
	if (!userId) {
		redirectToSignIn();
	}

	return (
		<NotificationsPageClient />
	)
}

export default NotificationsPage;

export {
	metadata
};