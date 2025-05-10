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
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			body: "",
		},
	});

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		console.log(values);
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
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input
											placeholder=""
											{...field}
											className="prose dark:prose-invert max-w-full"
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
								<FormItem>
									<FormLabel>Body</FormLabel>
									<FormControl>
										<Tiptap
											value={field.value}
											onChange={field.onChange}
											className="prose dark:prose-invert max-w-full"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-end">
							<Button type="submit">Submit</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default CreatePostPage;
