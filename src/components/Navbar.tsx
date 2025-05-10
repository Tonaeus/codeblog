import { Bell, Plus } from "lucide-react";
import CircularButton from "./ui/CircularButton";
import ModeToggle from "./ModeToggle";
import Link from "next/link";
import Clerk from "./Clerk";
import { currentUser } from "@clerk/nextjs/server";

const Navbar = async () => {
	const user = await currentUser();

	return (
		<nav className="h-14 grid grid-cols-2 md:grid-cols-3 px-8 border-b border-border">
			<div className="hidden md:block col-span-1"></div>
			<div className="col-span-1 flex justify-start md:justify-center items-center">
				<Link href="/" className="text-2xl font-bold">
					Codeblog
				</Link>
			</div>
			<div className="col-span-1 flex justify-end items-center">
				{user ? (
					<>
						<CircularButton variant="ghost" size="icon">
							<Link href="/create-post">
								<Plus />
							</Link>
						</CircularButton>
						<CircularButton variant="ghost" size="icon">
							<Bell />
						</CircularButton>
					</>
				) : null}
				<ModeToggle />
				<Clerk />
			</div>
		</nav>
	);
};

export default Navbar;
