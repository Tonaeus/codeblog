"use client";

import { useTheme } from "next-themes";
import CircularButton from "./ui/CircularButton";
import { Moon, Sun } from "lucide-react";

const ModeToggle = () => {
	const { theme, setTheme } = useTheme();

	return (
		<CircularButton
			variant="ghost"
			onClick={() => setTheme(theme === "light" ? "dark" : "light")}
		>
			<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
			<span className="sr-only">Toggle theme</span>
		</CircularButton>
	);
};

export default ModeToggle;
