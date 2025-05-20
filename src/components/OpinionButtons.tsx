"use client";

import { Opinion } from "@/types/Opinion";

import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import CircularButton from "./ui/CircularButton";
import numeral from "numeral";
import { useEffect, useState } from "react";
import { getOpinion, getPost, toggleOpinion } from "@/actions/post.action";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

type Post = Awaited<ReturnType<typeof getPost>>["post"];

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
	const [optimisticOpinion, setOptimisticOpinion] = useState<Opinion>(Opinion.Neutral);
	const [optimisticOpinionSum, setOptimisticOpinionSum] = useState(post?.opinionSum ?? 0);
	const [isloading, setIsLoading] = useState(false);

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
      toast.error(`You must be signed in to ${inputOpinion === Opinion.Positive ? "upvote" : "downvote"}.`, {
        position: "top-center",
        richColors: true,
      });
			return;
		};

		if (!post?.id || isloading) {
			return;
		}

		const oldOpinion = optimisticOpinion;
    const oldOpinionSum = optimisticOpinionSum;

		const { newOpinion, opinionSumChange } = opinionStateMachine(oldOpinion, inputOpinion);

		setIsLoading(true);
		try {
			setOptimisticOpinion(newOpinion);
      setOptimisticOpinionSum(oldOpinionSum + opinionSumChange);
			await toggleOpinion(post.id, inputOpinion);
		}
		catch {
      setOptimisticOpinion(oldOpinion);
      setOptimisticOpinionSum(oldOpinionSum);
		}
		finally {
			setIsLoading(false);
		}
	};

	return (
		<div
			className={`
      flex flex-row w-max rounded-full justify-center items-center transition-none
			${
				optimisticOpinion === Opinion.Neutral
					? "bg-accent"
					: "bg-primary text-primary-foreground"
			}
    `}
		>
			<CircularButton
				size="icon"
				variant="ghost"
				className={`
						-mr-9 z-10 group transition-none disabled:!opacity-100
						${
							optimisticOpinion === Opinion.Neutral
								? "bg-accent hover:bg-secondary/50"
								: "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground dark:hover:bg-primary/90"
						}
					`}
				onClick={() => handleOpinion(Opinion.Positive)}
				disabled={isloading}
			>
				<ArrowBigUp
					className={`
						transition-none
						${optimisticOpinion === Opinion.Neutral ? "group-hover:fill-current" : ""}
						${
							optimisticOpinion === Opinion.Positive
								? "text-primary-foreground fill-current"
								: ""
						}
					`}
				/>
			</CircularButton>
			<div className={`w-[35px] h-[35px] rounded-full bg-background`} />

			<span className="flex justify-center items-center mx-1">
				{formatOpinionSum(optimisticOpinionSum)}
			</span>

			<div className={`w-[35px] h-[35px] rounded-full bg-background`} />
			<CircularButton
				size="icon"
				variant="ghost"
				className={`
						-ml-9 z-10 group transition-none disabled:!opacity-100
						${
							optimisticOpinion === Opinion.Neutral
								? "bg-accent hover:bg-secondary/50"
								: "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground dark:hover:bg-primary/90"
						}
				`}
				onClick={() => handleOpinion(Opinion.Negative)}
				disabled={isloading}
			>
				<ArrowBigDown
					className={`
						transition-none
						${optimisticOpinion === Opinion.Neutral ? "group-hover:fill-current" : ""}
						${
							optimisticOpinion === Opinion.Negative
								? "text-primary-foreground fill-current"
								: ""
						}
					`}
				/>
			</CircularButton>
		</div>
	);
};

export default OpinionButtons;
