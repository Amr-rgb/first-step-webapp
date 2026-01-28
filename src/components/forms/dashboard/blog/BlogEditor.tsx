"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
// import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Blockquote from "@tiptap/extension-blockquote";

import Toolbar from "./Toolbar"; // Our enhanced toolbar

import Placeholder from "@tiptap/extension-placeholder";

export default function BlogEditor({
  value,
  onChange,
  placeholder,
  readOnly,
  dir = "rtl",
}: {
  value: string;
  onChange: (value: any) => void;
  placeholder?: string;
  readOnly?: boolean;
  dir?: "rtl" | "ltr";
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      // Image,
      Link.configure({
        openOnClick: false,
      }),
      Superscript,
      Subscript,
      Blockquote,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      Placeholder.configure({
        placeholder: placeholder || "",
      }),
    ],
    content: value,
    editable: !readOnly,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `min-h-[300px] border rounded-b-md p-4 ${
          dir === "rtl" ? "text-right" : "text-left"
        } outline-none`,
        dir: dir,
      },
    },
  });

  return (
    <div className="border rounded-md overflow-hidden">
      {!readOnly && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}
