import { auth } from '@clerk/nextjs/server';
import NotificationsPageClient from './NotificationsPageClient'

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