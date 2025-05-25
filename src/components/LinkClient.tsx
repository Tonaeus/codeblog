"use client";

import { useRouter } from "next/navigation";
import { MouseEvent, ReactNode } from "react";

type LinkClientProps = {
	href: string;
	children: ReactNode;
	className?: string;
};

const LinkClient = ({ href, children, className = "" }: LinkClientProps) => {
	const router = useRouter();

	const handleClick = (e: MouseEvent) => {
		e.stopPropagation();
		router.push(href);
	};

	return (
		<div onClick={handleClick} className={`cursor-pointer ${className}`} >
			{children}
		</div>
	);
};

export default LinkClient;
