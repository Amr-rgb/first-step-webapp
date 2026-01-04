"use client";

import { Editor } from "@tiptap/react";
import {
  Undo,
  Redo,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  // Image as ImageIcon,
  Link as LinkIcon,
  Code,
  Quote,
  Minus,
  ChevronDown,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

type Props = {
  editor: Editor | null;
};

export default function Toolbar({ editor }: Props) {
  if (!editor) return null;

  // const insertImage = () => {
  //   const url = prompt("رابط الصورة");
  //   if (url) {
  //     editor.chain().focus().setImage({ src: url }).run();
  //   }
  // };

  const [linkUrl, setLinkUrl] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setLinkUrl(editor.getAttributes("link").href || "");
    }
  }, [open, editor]);

  const handleSetLink = () => {
    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    }
    setOpen(false);
  };

  return (
    <div className="border-b p-2 flex flex-wrap gap-1 justify-end items-center">
      {/* Undo & Redo */}
      <Toggle
        onPressedChange={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo size={16} />
      </Toggle>
      <Toggle
        onPressedChange={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo size={16} />
      </Toggle>

      {/* Separator */}
      <div className="w-px h-6 bg-gray-200 mx-1"></div>

      {/* Heading Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Toggle className="px-2 flex items-center">
            <span className="mr-1">H</span>
            <ChevronDown size={12} />
          </Toggle>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            Heading 1
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            Heading 2
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            Heading 3
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
          >
            Heading 4
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 5 }).run()
            }
          >
            Heading 5
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 6 }).run()
            }
          >
            Heading 6
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().setParagraph().run()}
          >
            Paragraph
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Lists Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Toggle className="px-1">
            <List size={16} />
            <ChevronDown size={12} />
          </Toggle>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            Bullet List
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            Ordered List
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Image Upload */}
      {/* <Toggle onClick={insertImage}>
        <ImageIcon size={16} />
      </Toggle> */}

      {/* Separator */}
      <div className="w-px h-6 bg-gray-200 mx-1"></div>

      {/* Text Formatting */}
      <Toggle
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={16} />
      </Toggle>
      <Toggle
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={16} />
      </Toggle>
      <Toggle
        pressed={editor.isActive("underline")}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline size={16} />
      </Toggle>
      <Toggle
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough size={16} />
      </Toggle>

      {/* Code block */}
      <Toggle
        pressed={editor.isActive("codeBlock")}
        onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <Code size={16} />
      </Toggle>

      <Toggle
        pressed={editor.isActive("blockquote")}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote size={16} />
      </Toggle>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Toggle pressed={editor.isActive("link")}>
            <LinkIcon size={16} />
          </Toggle>
        </PopoverTrigger>
        <PopoverContent className="w-80 flex flex-col gap-2 p-3">
          <Input
            placeholder="https://example.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="h-8"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSetLink();
              }
            }}
          />
          <div className="flex justify-end gap-2">
            {editor.isActive("link") && (
              <Button
                variant="destructive"
                size="sm"
                className="h-8 rounded-md"
                onClick={() => {
                  editor.chain().focus().unsetLink().run();
                  setOpen(false);
                }}
              >
                إزالة
              </Button>
            )}
            <Button
              size="sm"
              className="h-8 rounded-md"
              onClick={handleSetLink}
            >
              حفظ
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Toggle
        onPressedChange={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus size={16} />
      </Toggle>

      {/* Superscript and Subscript */}
      <Toggle
        pressed={editor.isActive("superscript")}
        onPressedChange={() => editor.chain().focus().toggleSuperscript().run()}
      >
        <span className="font-mono text-xs">x²</span>
      </Toggle>
      <Toggle
        pressed={editor.isActive("subscript")}
        onPressedChange={() => editor.chain().focus().toggleSubscript().run()}
      >
        <span className="font-mono text-xs">x₂</span>
      </Toggle>

      {/* Separator */}
      <div className="w-px h-6 bg-gray-200 mx-1"></div>

      {/* Text Alignment */}
      <Toggle
        pressed={editor.isActive({ textAlign: "right" })}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign("right").run()
        }
      >
        <AlignRight size={16} />
      </Toggle>
      <Toggle
        pressed={editor.isActive({ textAlign: "center" })}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign("center").run()
        }
      >
        <AlignCenter size={16} />
      </Toggle>
      <Toggle
        pressed={editor.isActive({ textAlign: "left" })}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign("left").run()
        }
      >
        <AlignLeft size={16} />
      </Toggle>
      <Toggle
        pressed={editor.isActive({ textAlign: "justify" })}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign("justify").run()
        }
      >
        <AlignJustify size={16} />
      </Toggle>
    </div>
  );
}
