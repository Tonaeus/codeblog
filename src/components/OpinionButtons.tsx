"use client";

import { Opinion } from "@/types/Opinion";

import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import CircularButton from "./ui/CircularButton";
import numeral from "numeral";
import { useEffect, useState } from "react";
import { getOpinion, toggleOpinion } from "@/actions/post.action";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { Post } from "@/types/Post";

const opinionStateMachine = (oldOpinion: Opinion, inputOpinion: Opinion) => {
	if (oldOpinion === inputOpinion) {
		return {
			newOpinion: Opinion.Neutral,
			opinionSumChange: inputOpinion === Opinion.Positive ? -1 : 1,
		};
	}

	if (oldOpinion === Opinion.Neutral) {
		return {
			newOpinion: inputOpinion,
			opinionSumChange: inputOpinion === Opinion.Positive ? 1 : -1,
		};
	}

	return {
		newOpinion: inputOpinion,
		opinionSumChange: inputOpinion === Opinion.Positive ? 2 : -2,
	};
};

const formatOpinionSum = (opinions: number) => {
	if (opinions < 1000) {
		return opinions.toString();
	}

	const rounded = numeral(opinions).format("0.0a");
	const [num, suffix] = [rounded.slice(0, -1), rounded.slice(-1)];

	return num.endsWith(".0")
		? `${parseInt(num, 10)}${suffix.toUpperCase()}`
		: `${num}${suffix.toUpperCase()}`;
};

const OpinionButtons = ({ post }: { post: Post }) => {
	const [optimisticOpinion, setOptimisticOpinion] = useState<Opinion>(
		Opinion.Neutral
	);
	const [optimisticOpinionSum, setOptimisticOpinionSum] = useState(
		post?.opinionSum ?? 0
	);

	const { userId } = useAuth();

	useEffect(() => {
		const fetchOpinion = async () => {
			if (!userId || !post?.id) {
				return;
			}

			try {
				const result = await getOpinion(post.id);
				if (result?.success) {
					const opinion = result.opinion?.opinion;
					setOptimisticOpinion(opinion ?? Opinion.Neutral);
				}
			} catch (error) {
				console.error("Failed to fetch opinion:", error);
			}
		};

		fetchOpinion();
	}, [userId, post?.id]);

	const handleOpinion = async (inputOpinion: Opinion) => {
		if (!userId) {
			toast.error(
				`You must be signed in to ${
					inputOpinion === Opinion.Positive ? "upvote" : "downvote"
				}.`,
				{
					position: "top-center",
					richColors: true,
				}
			);
			return;
		}

		if (!post?.id) {
			return;
		}

		const oldOpinion = optimisticOpinion;
		const oldOpinionSum = optimisticOpinionSum;

		const { newOpinion, opinionSumChange } = opinionStateMachine(
			oldOpinion,
			inputOpinion
		);

		try {
			setOptimisticOpinion(newOpinion);
			setOptimisticOpinionSum(oldOpinionSum + opinionSumChange);
			await toggleOpinion(post.id, inputOpinion);
		} catch {
			setOptimisticOpinion(oldOpinion);
			setOptimisticOpinionSum(oldOpinionSum);
		}
	};

	const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		e.preventDefault();
	};

	const containerClasses =
		optimisticOpinion === Opinion.Neutral
			? "bg-accent brightness-95"
			: "bg-primary text-primary-foreground";

	const buttonClasses =
		optimisticOpinion === Opinion.Neutral
			? "bg-accent hover:brightness-95 dark:hover:brightness-150"
			: "hover:text-primary-foreground hover:!bg-primary hover:brightness-90";

	const upvoteClasses = [
		"transition-all",
		optimisticOpinion === Opinion.Positive
			? "text-primary-foreground fill-current"
			: "",
		optimisticOpinion === Opinion.Neutral
			? "group-hover/button:fill-current"
			: "",
	]
		.filter(Boolean)
		.join(" ");

	const downvoteClasses = [
		"transition-all",
		optimisticOpinion === Opinion.Negative
			? "text-primary-foreground fill-current"
			: "",
		optimisticOpinion === Opinion.Neutral
			? "group-hover/button:fill-current"
			: "",
	]
		.filter(Boolean)
		.join(" ");

	return (
		<div
			className={`flex flex-row w-max rounded-full justify-center items-center cursor-default transition-all ${containerClasses}`}
			onClick={(e) => handleClick(e)}
		>
			<CircularButton
				size="icon"
				variant="ghost"
				className={`group/button transition-all ${buttonClasses}`}
				onClick={() => handleOpinion(Opinion.Positive)}
			>
				<ArrowBigUp className={upvoteClasses} />
			</CircularButton>

			<span className="flex justify-center items-center mx-1 transition-all">
				{formatOpinionSum(optimisticOpinionSum)}
			</span>

			<CircularButton
				size="icon"
				variant="ghost"
				className={`group/button transition-all ${buttonClasses}`}
				onClick={() => handleOpinion(Opinion.Negative)}
			>
				<ArrowBigDown className={downvoteClasses} />
			</CircularButton>
		</div>
	);
};

export default OpinionButtons;
