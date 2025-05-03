import { Bell, Moon, Plus, User } from "lucide-react";
import CircularButton from "./ui/CircularButton";

const Navbar = () => {
	return (
		<nav className="h-14 grid grid-cols-2 lg:grid-cols-3 px-4">
			<div className="hidden lg:block col-span-1"></div>
			<div className="col-span-1 flex justify-start lg:justify-center items-center">
				<h1 className="text-2xl font-bold">Codeblog</h1>
			</div>
			<div className="col-span-1 flex justify-end items-center">
				<CircularButton variant="ghost" className="h-10">
					<Plus />
				</CircularButton>
				<CircularButton variant="ghost" className="h-10">
					<Bell />
				</CircularButton>
				<CircularButton variant="ghost" className="h-10">
					<Moon />
				</CircularButton>
				<CircularButton variant="ghost" className="h-10">
					<User />
				</CircularButton>
			</div>
		</nav>
	);
};

export default Navbar;
