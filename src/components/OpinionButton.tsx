"use client";

import { Opinion } from "@/types/Opinion";

import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import CircularButton from "./ui/CircularButton";
import numeral from "numeral";
import { useState } from "react";

const formatOpinions = (opinions: number) => {
	if (opinions < 1000) {
		return opinions.toString();
	}

	const rounded = numeral(opinions).format("0.0a");
	const [num, suffix] = [rounded.slice(0, -1), rounded.slice(-1)];

	return num.endsWith(".0")
		? `${parseInt(num, 10)}${suffix.toUpperCase()}`
		: `${num}${suffix.toUpperCase()}`;
};

const OpinionButton = ({ opinionSum = 1000 }: { opinionSum?: number }) => {
	const [userOpinion, setUserOpinion] = useState<Opinion>(Opinion.Neutral);
	const [isloading, setIsLoading] = useState(false);

	const handleUpvote = () => {
		console.log("Upvoted");
	};

	const handleDownvote = () => {
		console.log("Downvoted");
	};

	return (
		<div
			className={`
      flex flex-row w-max rounded-full justify-center items-center
			${
				userOpinion === Opinion.Neutral
					? "bg-accent"
					: "bg-primary text-primary-foreground"
			}
    `}
		>
			<CircularButton
				size="icon"
				variant="ghost"
				className={`
						-mr-9 z-10 group
						${
							userOpinion === Opinion.Neutral
								? "bg-accent hover:bg-secondary/50"
								: "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground dark:hover:bg-primary/90"
						}
					`}
				onClick={handleUpvote}
			>
				<ArrowBigUp
					className={`
						transition-all
						${userOpinion === Opinion.Neutral ? "group-hover:fill-current" : ""}
						${
							userOpinion === Opinion.Positive
								? "text-primary-foreground fill-current"
								: ""
						}
					`}
				/>
			</CircularButton>
			<div className={`w-[35px] h-[35px] rounded-full bg-background`} />

			<span className="flex justify-center items-center mx-1">
				{formatOpinions(opinionSum)}
			</span>

			<div className={`w-[35px] h-[35px] rounded-full bg-background`} />
			<CircularButton
				size="icon"
				variant="ghost"
				className={`
						-ml-9 z-10 group
						${
							userOpinion === Opinion.Neutral
								? "bg-accent hover:bg-secondary/50"
								: "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground dark:hover:bg-primary/90"
						}
				`}
				onClick={handleDownvote}
			>
				<ArrowBigDown
					className={`
						transition-all
						${userOpinion === Opinion.Neutral ? "group-hover:fill-current" : ""}
						${
							userOpinion === Opinion.Negative
								? "text-primary-foreground fill-current"
								: ""
						}
					`}
				/>
			</CircularButton>
		</div>
	);
};

export default OpinionButton;
