'use client';

import dynamic from "next/dynamic";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";

const QuillNoSSRWrapper = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const BodyEditor = ({ body, setBody, handleContextCopy, handleContextPaste, handleContextCut }) => {
  const quillModules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
    ],
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="h-64 overflow-y-auto">
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
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default BodyEditor;
