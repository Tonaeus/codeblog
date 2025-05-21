"use client";

import { Loader2Icon, Trash } from "lucide-react";
import CircularButton from "./CircularButton";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type DeleteAlertDialogProps = {
	isDeleting: boolean;
	handleDelete: () => void;
	title: string;
	description: string;
};

const DeleteAlertDialog = ({
	isDeleting,
	handleDelete,
	title,
	description,
}: DeleteAlertDialogProps) => {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<CircularButton variant="ghost" size="icon">
					{isDeleting ? <Loader2Icon className="animate-spin" /> : <Trash />}
				</CircularButton>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeleteAlertDialog;
