import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import CircularButton from "./ui/CircularButton";
import numeral from "numeral";

const formatOpinions = (opinions: number) => {
  if (opinions < 1000) {
    return opinions.toString();
  }

  const rounded = numeral(opinions).format("0.0a");
  const [num, suffix] = [rounded.slice(0, -1), rounded.slice(-1)];

  return num.endsWith('.0')
    ? `${parseInt(num, 10)}${suffix.toUpperCase()}`
    : `${num}${suffix.toUpperCase()}`;
};

type OpinionButtonProps = {
	opinions?: number;
	userOpinion?: -1 | 0 | 1;
	onUpvote?: () => void;
	onDownvote?: () => void;
};

const OpinionButton = ({
	opinions = 1000,
	userOpinion,
	onUpvote,
	onDownvote,
}: OpinionButtonProps) => {
	return (
		<div className="flex flex-row bg-primary-foreground w-max rounded-full">
			<CircularButton
				size="icon"
				variant="ghost"
				className="hover:bg-primary/90 hover:text-primary-foreground"
			>
				<ArrowBigUp />
			</CircularButton>
			<span className="flex justify-center items-center mx-1">
				{formatOpinions(opinions)}
			</span>
			<CircularButton
				size="icon"
				variant="ghost"
				className="hover:bg-primary/90 hover:text-primary-foreground"
			>
				<ArrowBigDown />
			</CircularButton>
		</div>
	);
};

export default OpinionButton;
