import { Button } from "@/components/ui/button";
import Link from "next/link";

const notFoundPage = () => {
	return (
		<div className="flex flex-col flex-1 justify-center items-center p-4 gap-8">
			<h1 className="text-8xl font-bold">404</h1>
			<h2 className="text-2xl font-semibold">Page Not Found</h2>
			<p>Sorry, the page you are looking for does not exist.</p>
			<Button>
				<Link href="/">Back to Home</Link>
			</Button>
		</div>
	);
};

export default notFoundPage;
