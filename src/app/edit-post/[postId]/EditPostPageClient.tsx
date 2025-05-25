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
import { editPost, getEditPost } from "@/actions/post.action";
import { useRouter } from "next/navigation";
import { Loader2Icon, SendIcon } from "lucide-react";
import { toast } from "sonner";

type EditPost = Awaited<ReturnType<typeof getEditPost>>["post"];

const formSchema = z.object({
	title: z
		.string()
		.min(1, { message: "Title is required" })
		.max(256, { message: "Title must be at most 256 characters" })
		.refine((val) => val.trim().length > 0, {
			message: "Title is required",
		}),
	description: z
		.string()
		.min(1, { message: "Description is required" })
		.max(512, { message: "Description must be at most 512 characters" })
		.refine((val) => val.trim().length > 0, {
			message: "Description is required",
		}),
	body: z
		.string()
		.min(1, { message: "Body is required" })
		.max(32768, { message: "Body must be at most 32768 characters" })
		.refine((val) => val.replace(/<[^>]*>/g, "").trim().length > 0, {
			message: "Body is required",
		}),
});

const EditPostPageClient = ({ post }: { post: EditPost }) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: post?.title,
			description: post?.description,
			body: post?.body,
		},
	});

	const tiptapRef = useRef<{ focus: () => void }>(null);

	const [isEditing, setIsEditing] = useState(false);
	const router = useRouter();

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setIsEditing(true);
		try {
			const result = await editPost(post!.id, values.title, values.description, values.body); // POST request
			if (result?.success) {
				form.reset();
				router.push(`/post/${post!.id}`);
				toast.success("Your post has been edited!", {
					position: "top-center",
					richColors: true,
				});
			} else {
				toast.error("Failed to edit your post.", {
					position: "top-center",
					richColors: true,
				});
			}
		} catch (error) {
			console.error("Failed to edit post", error);
			toast.error("Failed to edit your post.", {
				position: "top-center",
				richColors: true,
			});
		} finally {
			setIsEditing(false);
		}
	};

	return (
		<div className="flex flex-col flex-1 w-full items-center">
			<div className="max-w-3xl w-full p-4 flex flex-1">
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
											disabled={isEditing}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="cursor-pointer">Description</FormLabel>
									<FormControl>
										<Input
											placeholder=""
											{...field}
											className="prose dark:prose-invert max-w-full !text-base"
											disabled={isEditing}
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
											disabled={isEditing}
											invalid={!!form.formState.errors.body}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-end">
							<Button type="submit" disabled={isEditing}>
								{isEditing ? (
									<>
										<Loader2Icon className="animate-spin" />
										Editing...
									</>
								) : (
									<>
										<SendIcon />
										Edit
									</>
								)}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default EditPostPageClient;
