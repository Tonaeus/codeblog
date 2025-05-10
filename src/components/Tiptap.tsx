"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import Underline from "@tiptap/extension-underline";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";

import {
	BoldIcon,
	CodeIcon,
	EllipsisVerticalIcon,
	HeadingIcon,
	ItalicIcon,
	ListIcon,
	ListOrderedIcon,
	MinusIcon,
	QuoteIcon,
	RedoIcon,
	StrikethroughIcon,
	SubscriptIcon,
	SuperscriptIcon,
	UnderlineIcon,
	UndoIcon,
} from "lucide-react";

import { Toggle } from "./ui/toggle";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { useEffect, useState } from "react";

const VerticalDivider = ({ className = "" }) => (
	<div className={`mx-1 flex items-center ${className}`}>
		<div className="w-px h-5 bg-border" />
	</div>
);

type EditorToolbarProps = {
	editor: Editor | null;
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	className?: string;
};

const EditorToolbar = ({
	editor,
	isOpen,
	setIsOpen,
	className,
}: EditorToolbarProps) => {
	const isMac = /mac/i.test(navigator.userAgent);
	const [width, setWidth] = useState(0);

	useEffect(() => {
			const handleResize = () => setWidth(window.innerWidth);
			window.addEventListener("resize", handleResize);
			return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		if (width >= 128 + 14 * 36 + 5 * 9) {
			setIsOpen(false);
		}
	}, [width]);

	if (!editor) {
		return null;
	}

	return (
		<div className={`flex flex-row ${className}`}>
			<Toggle
				value="undo"
				onClick={() => editor.chain().focus().undo().run()}
				data-state="off"
				className="max-tp1:hidden"
			>
				<UndoIcon />
			</Toggle>
			<Toggle
				value="redo"
				onClick={() => editor.chain().focus().redo().run()}
				data-state="off"
				className="max-tp2:hidden"
			>
				<RedoIcon />
			</Toggle>

			<VerticalDivider className="max-tp3:hidden" />

			<Toggle
				value="heading"
				onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
				data-state={editor.isActive("heading", { level: 2 }) ? "on" : "off"}
				className="max-tp3:hidden"
			>
				<HeadingIcon />
			</Toggle>
			<Toggle
				value="horizontalRule"
				onClick={() => editor.chain().focus().setHorizontalRule().run()}
				data-state="off"
				className="max-tp4:hidden"
			>
				<MinusIcon />
			</Toggle>

			<VerticalDivider className="max-tp5:hidden" />

			<Toggle
				value="bold"
				onClick={() => editor.chain().focus().toggleBold().run()}
				data-state={editor.isActive("bold") ? "on" : "off"}
				className="max-tp5:hidden"
			>
				<BoldIcon />
			</Toggle>
			<Toggle
				value="italic"
				onClick={() => editor.chain().focus().toggleItalic().run()}
				data-state={editor.isActive("italic") ? "on" : "off"}
				className="max-tp6:hidden"
			>
				<ItalicIcon />
			</Toggle>
			<Toggle
				value="underline"
				onClick={() => editor.chain().focus().toggleUnderline().run()}
				data-state={editor.isActive("underline") ? "on" : "off"}
				className="max-tp7:hidden"
			>
				<UnderlineIcon />
			</Toggle>
			<Toggle
				value="strike"
				onClick={() => editor.chain().focus().toggleStrike().run()}
				data-state={editor.isActive("strike") ? "on" : "off"}
				className="max-tp8:hidden"
			>
				<StrikethroughIcon />
			</Toggle>

			<VerticalDivider className="max-tp9:hidden" />

			<Toggle
				value="superscript"
				onClick={() => editor.chain().focus().toggleSuperscript().run()}
				data-state={editor.isActive("superscript") ? "on" : "off"}
				className="max-tp9:hidden"
			>
				<SuperscriptIcon />
			</Toggle>
			<Toggle
				value="subscript"
				onClick={() => editor.chain().focus().toggleSubscript().run()}
				data-state={editor.isActive("subscript") ? "on" : "off"}
				className="max-tp10:hidden"
			>
				<SubscriptIcon />
			</Toggle>

			<VerticalDivider className="max-tp11:hidden" />

			<Toggle
				value="blockquote"
				onClick={() => editor.chain().focus().toggleBlockquote().run()}
				data-state={editor.isActive("blockquote") ? "on" : "off"}
				className="max-tp11:hidden"
			>
				<QuoteIcon />
			</Toggle>
			<Toggle
				value="codeBlock"
				onClick={() =>
					editor
						.chain()
						.focus()
						.toggleCodeBlock({ language: "javascript" })
						.run()
				}
				data-state={editor.isActive("codeBlock") ? "on" : "off"}
				className="max-tp12:hidden"
			>
				<CodeIcon />
			</Toggle>

			<VerticalDivider className="max-tp13:hidden" />

			<Toggle
				value="bulletList"
				onClick={() => editor.chain().focus().toggleBulletList().run()}
				data-state={editor.isActive("bulletList") ? "on" : "off"}
				className="max-tp13:hidden"
			>
				<ListIcon />
			</Toggle>
			<Toggle
				value="orderedList"
				onClick={() => editor.chain().focus().toggleOrderedList().run()}
				data-state={editor.isActive("orderedList") ? "on" : "off"}
				className="max-tp14:hidden"
			>
				<ListOrderedIcon />
			</Toggle>

			<VerticalDivider className="max-tp1:hidden tp14:hidden" />

			<DropdownMenu open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
				<DropdownMenuTrigger asChild className="tp14:hidden">
					<Toggle
						data-state={isOpen ? "on" : "off"}
						className="focus-visible:ring-0 focus-visible:ring-offset-0"
					>
						<EllipsisVerticalIcon />
					</Toggle>
				</DropdownMenuTrigger>

				<DropdownMenuContent className="w-56">
					<DropdownMenuItem
						asChild
						onSelect={(event) => {
							event.preventDefault();
							editor.chain().focus().undo().run();
						}}
						className="tp1:hidden"
					>
						<Toggle
							value="undo"
							data-state="off"
							className="w-full justify-start focus-visible:ring-0 focus-visible:ring-offset-0"
						>
							<UndoIcon /> Undo
							<DropdownMenuShortcut>{isMac ? "⌘Z" : ""}</DropdownMenuShortcut>
						</Toggle>
					</DropdownMenuItem>

					<DropdownMenuItem
						asChild
						onSelect={(event) => {
							event.preventDefault();
							editor.chain().focus().redo().run();
						}}
						className="tp2:hidden"
					>
						<Toggle
							value="redo"
							data-state="off"
							className="w-full justify-start focus-visible:ring-0 focus-visible:ring-offset-0"
						>
							<RedoIcon /> Redo
							<DropdownMenuShortcut>{isMac ? "⌘⇧Z" : ""}</DropdownMenuShortcut>
						</Toggle>
					</DropdownMenuItem>

					<DropdownMenuSeparator className="tp2:hidden" />

					<DropdownMenuItem
						asChild
						onSelect={(event) => {
							event.preventDefault();
							editor.chain().focus().toggleHeading({ level: 2 }).run();
						}}
						className="tp3:hidden"
					>
						<Toggle
							value="heading"
							data-state={
								editor.isActive("heading", { level: 2 }) ? "on" : "off"
							}
							className="w-full justify-start focus-visible:ring-0 focus-visible:ring-offset-0"
						>
							<HeadingIcon /> Heading
						</Toggle>
					</DropdownMenuItem>

					<DropdownMenuItem
						asChild
						onSelect={(event) => {
							event.preventDefault();
							editor.chain().focus().setHorizontalRule().run();
						}}
						className="tp4:hidden"
					>
						<Toggle
							value="horizontalRule"
							data-state="off"
							className="w-full justify-start focus-visible:ring-0 focus-visible:ring-offset-0"
						>
							<MinusIcon /> Horizontal Rule
						</Toggle>
					</DropdownMenuItem>

					<DropdownMenuSeparator className="tp4:hidden" />

					<DropdownMenuItem
						asChild
						onSelect={(event) => {
							event.preventDefault();
							editor.chain().focus().toggleBold().run();
						}}
						className="tp5:hidden"
					>
						<Toggle
							value="bold"
							data-state={editor.isActive("bold") ? "on" : "off"}
							className="w-full justify-start focus-visible:ring-0 focus-visible:ring-offset-0"
						>
							<BoldIcon /> Bold
							<DropdownMenuShortcut>{isMac ? "⌘B" : ""}</DropdownMenuShortcut>
						</Toggle>
					</DropdownMenuItem>

					<DropdownMenuItem
						asChild
						onSelect={(event) => {
							event.preventDefault();
							editor.chain().focus().toggleItalic().run();
						}}
						className="tp6:hidden"
					>
						<Toggle
							value="italic"
							data-state={editor.isActive("italic") ? "on" : "off"}
							className="w-full justify-start focus-visible:ring-0 focus-visible:ring-offset-0"
						>
							<ItalicIcon /> Italic
							<DropdownMenuShortcut>{isMac ? "⌘I" : ""}</DropdownMenuShortcut>
						</Toggle>
					</DropdownMenuItem>

					<DropdownMenuItem
						asChild
						onSelect={(event) => {
							event.preventDefault();
							editor.chain().focus().toggleUnderline().run();
						}}
						className="tp7:hidden"
					>
						<Toggle
							value="underline"
							data-state={editor.isActive("underline") ? "on" : "off"}
							className="w-full justify-start focus-visible:ring-0 focus-visible:ring-offset-0"
						>
							<UnderlineIcon /> Underline
							<DropdownMenuShortcut>{isMac ? "⌘U" : ""}</DropdownMenuShortcut>
						</Toggle>
					</DropdownMenuItem>

					<DropdownMenuItem
						asChild
						onSelect={(event) => {
							event.preventDefault();
							editor.chain().focus().toggleStrike().run();
						}}
						className="tp8:hidden"
					>
						<Toggle
							value="strike"
							data-state={editor.isActive("strike") ? "on" : "off"}
							className="w-full justify-start focus-visible:ring-0 focus-visible:ring-offset-0"
						>
							<StrikethroughIcon /> Strike
							<DropdownMenuShortcut>{isMac ? "⌘⇧X" : ""}</DropdownMenuShortcut>
						</Toggle>
					</DropdownMenuItem>

					<DropdownMenuSeparator className="tp8:hidden" />

					<DropdownMenuItem
						asChild
						onSelect={(event) => {
							event.preventDefault();
							editor.chain().focus().toggleSuperscript().run();
						}}
						className="tp9:hidden"
					>
						<Toggle
							value="superscript"
							data-state={editor.isActive("superscript") ? "on" : "off"}
							className="w-full justify-start focus-visible:ring-0 focus-visible:ring-offset-0"
						>
							<SuperscriptIcon /> Superscript
						</Toggle>
					</DropdownMenuItem>

					<DropdownMenuItem
						asChild
						onSelect={(event) => {
							event.preventDefault();
							editor.chain().focus().toggleSubscript().run();
						}}
						className="tp10:hidden"
					>
						<Toggle
							value="subscript"
							data-state={editor.isActive("subscript") ? "on" : "off"}
							className="w-full justify-start focus-visible:ring-0 focus-visible:ring-offset-0"
						>
							<SubscriptIcon /> Subscript
						</Toggle>
					</DropdownMenuItem>

					<DropdownMenuSeparator className="tp10:hidden" />

					<DropdownMenuItem
						asChild
						onSelect={(event) => {
							event.preventDefault();
							editor.chain().focus().toggleBlockquote().run();
						}}
						className="tp11:hidden"
					>
						<Toggle
							value="blockquote"
							data-state={editor.isActive("blockquote") ? "on" : "off"}
							className="w-full justify-start focus-visible:ring-0 focus-visible:ring-offset-0"
						>
							<QuoteIcon /> Blockquote
						</Toggle>
					</DropdownMenuItem>

					<DropdownMenuItem
						asChild
						onSelect={(event) => {
							event.preventDefault();
							editor
								.chain()
								.focus()
								.toggleCodeBlock({ language: "javascript" })
								.run();
						}}
						className="tp12:hidden"
					>
						<Toggle
							value="codeBlock"
							data-state={editor.isActive("codeBlock") ? "on" : "off"}
							className="w-full justify-start focus-visible:ring-0 focus-visible:ring-offset-0"
						>
							<CodeIcon /> Code Block
						</Toggle>
					</DropdownMenuItem>

					<DropdownMenuSeparator className="tp12:hidden" />

					<DropdownMenuItem
						asChild
						onSelect={(event) => {
							event.preventDefault();
							editor.chain().focus().toggleBulletList().run();
						}}
						className="tp13:hidden"
					>
						<Toggle
							value="bulletList"
							data-state={editor.isActive("bulletList") ? "on" : "off"}
							className="w-full justify-start focus-visible:ring-0 focus-visible:ring-offset-0"
						>
							<ListIcon /> Bullet List
							<DropdownMenuShortcut>{isMac ? "⌘⇧8" : ""}</DropdownMenuShortcut>
						</Toggle>
					</DropdownMenuItem>

					<DropdownMenuItem
						asChild
						onSelect={(event) => {
							event.preventDefault();
							editor.chain().focus().toggleOrderedList().run();
						}}
						className="tp14:hidden"
					>
						<Toggle
							value="orderedList"
							data-state={editor.isActive("orderedList") ? "on" : "off"}
							className="w-full justify-start focus-visible:ring-0 focus-visible:ring-offset-0"
						>
							<ListOrderedIcon /> Ordered List
							<DropdownMenuShortcut>{isMac ? "⌘⇧7" : ""}</DropdownMenuShortcut>
						</Toggle>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

type TiptapProps = {
	value: string;
	onChange: (value: string) => void;
	className?: string;
};

const Tiptap = ({ value, onChange, className }: TiptapProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const lowlight = createLowlight(all);

	const editor = useEditor({
		immediatelyRender: false,
		// editable: false,
		extensions: [
			StarterKit,
			Underline,
			Superscript,
			Subscript,
			CodeBlockLowlight.configure({ lowlight }),
		],
		editorProps: {
			attributes: {
				class: `${className ?? ""} focus:outline-none`,
			},
		},
		content: value,
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
	});

	useEffect(() => {
		if (editor && value !== editor.getHTML()) {
			editor.commands.setContent(value);
		}
	}, [value, editor]);

	return (
		<div
			tabIndex={0}
			className={`
        border border-input bg-transparent dark:bg-input/30
				${isOpen ? "border-ring ring-ring/50 ring-[3px]" : ""}
        focus:border-ring focus:ring-ring/50 focus:ring-[3px] transition-[color,box-shadow]
        focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]
        flex flex-col rounded-md shadow-xs
        outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none
				overflow-hidden 
				flex-1
      `}
		>
			<EditorToolbar
				editor={editor}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				className="p-1"
			/>
			<EditorContent editor={editor} className="px-3 pb-1 hyphens-auto" />
		</div>
	);
};

export default Tiptap;
