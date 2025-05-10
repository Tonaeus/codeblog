"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import CircularButton from "./ui/CircularButton";
import { User } from "lucide-react";
import { dark } from "@clerk/themes";

const Clerk = () => {
	const { theme } = useTheme();
	const { user } = useUser();

	return (
		<>
			{user ? (
				<div className="w-9 h-9 flex justify-center items-center">
					<UserButton
						appearance={{
							baseTheme: theme == "dark" ? dark : undefined,
						}}
					/>
				</div>
			) : (
				<SignInButton
					mode="modal"
					appearance={{
						baseTheme: theme == "dark" ? dark : undefined,
					}}
				>
					<CircularButton variant="ghost" size="icon">
						<User />
					</CircularButton>
				</SignInButton>
			)}
		</>
	);
};

export default Clerk;
