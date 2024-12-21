"use client";

import dynamic from "next/dynamic";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";

const QuillNoSSRWrapper = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const BodyEditor = ({ body, setBody, handleContextCopy, handleContextPaste, handleContextCut }) => {
  const quillModules = {
    toolbar: [
      [{ font: [] }], // Font family
      [{ size: ["small", false, "large", "huge"] }], // Font size
      ["bold", "italic", "underline", "strike"], // Text styling
      [{ color: [] }, { background: [] }], // Text color and background
      [{ align: [] }], // Text alignment
      [{ list: "ordered" }, { list: "bullet" }], // Lists
      ["blockquote", "code-block"], // Blockquote and code block
      ["link", "image", "video"], // Media
      ["clean"], // Clear formatting
    ],
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="h-64 my-5 overflow-y-auto">
          <QuillNoSSRWrapper
            value={body}
            onChange={setBody}
            className="h-full bg-white rounded border overflow-y-auto"
            theme="snow"
            modules={quillModules}
          />
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleContextCopy}>Copy</ContextMenuItem>
        <ContextMenuItem onClick={handleContextPaste}>Paste</ContextMenuItem>
        <ContextMenuItem onClick={handleContextCut}>Cut</ContextMenuItem>
        <ContextMenuItem onClick={() => document.execCommand("bold")}>Bold</ContextMenuItem>
        <ContextMenuItem onClick={() => document.execCommand("italic")}>Italic</ContextMenuItem>
        <ContextMenuItem onClick={() => document.execCommand("underline")}>Underline</ContextMenuItem>
        <ContextMenuItem onClick={() => document.execCommand("removeFormat")}>Clear Formatting</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default BodyEditor;
