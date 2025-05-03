import { Button } from "@/components/ui/button";

import { ReactNode } from "react";
import { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";

type CircularButtonProps = {
	children: ReactNode;
	onClick?: () => void;
  variant?: VariantProps<typeof buttonVariants>["variant"];
	className?: string;
};

const CircularButton = ({
	children,
	onClick,
  variant,
	className,
}: CircularButtonProps) => {
	return (
		<Button
			onClick={onClick}
      variant={variant}
			className={`aspect-square rounded-full ${className}`}
		>
			{children}
		</Button>
	);
};

export default CircularButton;
