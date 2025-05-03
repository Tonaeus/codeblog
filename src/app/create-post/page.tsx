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
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
		.min(1, { message: "Title is required" })
		.max(32768)
		.refine((val) => val.trim().length > 0, {
			message: "Title is required",
		}),
});

const createPage = () => {
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
		<div className="">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input placeholder="" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Tabs defaultValue="Edit">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="Edit">Edit</TabsTrigger>
							<TabsTrigger value="Preview">Preview</TabsTrigger>
						</TabsList>
						<TabsContent value="Edit">
							<FormField
								control={form.control}
								name="body"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Body</FormLabel>
										<FormControl>
											<Textarea
												placeholder=""
												className="resize-none"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</TabsContent>
						<TabsContent value="Preview"></TabsContent>
					</Tabs>
					<div className="flex justify-end">
						<Button type="submit">Submit</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default createPage;
