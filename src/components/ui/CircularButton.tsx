import { Button } from "@/components/ui/button";

import { ReactNode } from "react";
import { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";

type CircularButtonProps = {
	children: ReactNode;
	className?: string;
} 
& VariantProps<typeof buttonVariants> 
& React.ButtonHTMLAttributes<HTMLButtonElement>;

const CircularButton = ({
	children,
	className,
	...props
}: CircularButtonProps) => {
	return (
		<Button
			{...props}
			className={`aspect-square rounded-full ${className ?? ""}`}
		>
			{children}
		</Button>
	);
};

export default CircularButton;
