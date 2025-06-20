"use client";

// import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ErrorPage = ({}: // error,
// reset,
{
	// error: Error & { digest?: string };
	// reset: () => void;
}) => {
	// useEffect(() => {
	// 	console.error(error);
	// }, [error]);

	// return (
	// 	<div>
	// 		<h2>Something went wrong!</h2>
	// 		<button
	// 			onClick={
	// 				// Attempt to recover by trying to re-render the segment
	// 				() => reset()
	// 			}
	// 		>
	// 			Try again
	// 		</button>
	// 	</div>
	// );
	return (
		<div className="flex flex-col flex-1 justify-center items-center p-4 gap-8">
			<h1 className="text-8xl font-bold">Oops</h1>
			<h2 className="text-2xl font-semibold">Something Went Wrong</h2>
			<p>Sorry, the page you are loading is not available.</p>
			<Button>
				<Link href="/">Back to Home</Link>
			</Button>
		</div>
	);
};

export default ErrorPage;
