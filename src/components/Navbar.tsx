import { Bell, Plus, User } from "lucide-react";
import CircularButton from "./ui/CircularButton";
import ModeToggle from "./ModeToggle";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

const Navbar = async () => {
	const user = await currentUser();

	return (
		<nav className="h-14 grid grid-cols-2 md:grid-cols-3 px-4 border-b border-border">
			<div className="hidden md:block col-span-1"></div>
			<div className="col-span-1 flex justify-start md:justify-center items-center">
				<h1 className="text-2xl font-bold">Codeblog</h1>
			</div>
			<div className="col-span-1 flex justify-end items-center">
				<CircularButton variant="ghost" size="icon">
					<Plus />
				</CircularButton>
				<CircularButton variant="ghost" size="icon">
					<Bell />
				</CircularButton>
				<ModeToggle />
				{user ? (
					<div className="w-9 h-9 flex justify-center items-center">
						<UserButton />
					</div>
				) : (
					<SignInButton>
						<CircularButton variant="ghost" size="icon">
							<User />
						</CircularButton>
					</SignInButton>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
