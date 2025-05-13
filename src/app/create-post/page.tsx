"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Tiptap from "@/components/Tiptap";
import { useRef, useState } from "react";
import { RedirectToSignIn, useAuth } from "@clerk/nextjs";
import { createPost } from "@/actions/post.action";
import router from "next/router";

const formSchema = z.object({
	title: z
		.string()
		.min(1, { message: "Title is required" })
		.max(256)
		.refine((val) => val.trim().length > 0, {
			message: "Title is required",
		}),
	body: z
		.string()
		.min(1, { message: "Body is required" })
		.max(32768)
		.refine((val) => val.trim().length > 0, {
			message: "Body is required",
		}),
});

const CreatePostPage = () => {
	const { isSignedIn } = useAuth();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			body: "",
		},
	});

	const tiptapRef = useRef<{ focus: () => void }>(null);

	const [isPosting, setIsPosting] = useState(false);

	if (!isSignedIn) {
		return <RedirectToSignIn />
	}

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setIsPosting(true);
		try {
			// const response = await createPost(values.title, values.title); // POST request
			// if (response?.success) {
			// 	form.reset();
			// }
		}
		catch (error) {
			console.log("Failed to create post:", error);
		}
		finally {
			setIsPosting(false);
			router.push('/');
		}
	};

	return (
		<div className="flex flex-col flex-1 w-full items-center">
			<div className="max-w-3xl w-full p-8 flex flex-1">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="w-full flex flex-col space-y-4"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="cursor-pointer">Title</FormLabel>
									<FormControl>
										<Input
											placeholder=""
											{...field}
											className="prose dark:prose-invert max-w-full !text-base"
											disabled={isPosting}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="body"
							render={({ field }) => (
								<FormItem className="flex flex-col flex-1">
									<FormLabel
										onClick={() => {
											tiptapRef.current?.focus();
										}}
										className="cursor-pointer"
									>
										Body
									</FormLabel>
									<FormControl>
										<Tiptap
											ref={tiptapRef}
											value={field.value}
											onChange={field.onChange}
											className="prose dark:prose-invert max-w-full"
											disabled={isPosting}
											invalid={!!form.formState.errors.body}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-end">
							<Button type="submit">Post</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default CreatePostPage;
