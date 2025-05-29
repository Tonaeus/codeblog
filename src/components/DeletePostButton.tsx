"use client";

import { useState } from "react";
import DeleteAlertDialog from "./ui/DeleteAlertDialog";
import { deletePost } from "@/actions/post.action";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

type DeletePostButtonProps = {
	postId: string;
	btnClassName?: string;
};

const DeletePostButton = ({ postId, btnClassName }: DeletePostButtonProps) => {
	const [isDeleting, setIsDeleting] = useState(false);
	const pathname = usePathname();
	const router = useRouter();

	const handleDelete = async () => {
		if (isDeleting) {
			return;
		}

		setIsDeleting(true);
		try {
			const result = await deletePost(postId);
			if (result?.success) {
				const basePath = pathname.split("/")[1];
				if (basePath === "post") {
					router.push("/");
				}
				toast.success("Your post has been deleted!", {
					position: "top-center",
					richColors: true,
				});
			} else {
				throw new Error();
			}
		} catch (error) {
			console.error("Failed to delete post", error);
			toast.error("Failed to delete your post.", {
				position: "top-center",
				richColors: true,
			});
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<DeleteAlertDialog
			isDeleting={isDeleting}
			handleDelete={handleDelete}
			title="Delete Post"
			description="Are you sure you want to delete the post?"
			btnClassName={btnClassName}
		/>
	);
};

export default DeletePostButton;
