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



















// "use client";

// import dynamic from "next/dynamic";
// import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
// import { Card, CardContent } from "@/components/ui/card";
// import { Loader2 } from "lucide-react";

// const QuillNoSSRWrapper = dynamic(() => import("react-quill"), {
//   ssr: false,
//   loading: () => (
//     <div className="flex items-center justify-center h-64">
//       <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
//     </div>
//   ),
// });

// const BodyEditor = ({ 
//   body, 
//   setBody, 
//   handleContextCopy, 
//   handleContextPaste, 
//   handleContextCut 
// }) => {
//   const quillModules = {
//     toolbar: [
//       [{ font: [] }],
//       [{ size: ["small", false, "large", "huge"] }],
//       ["bold", "italic", "underline", "strike"],
//       [{ color: [] }, { background: [] }],
//       [{ align: [] }],
//       [{ list: "ordered" }, { list: "bullet" }],
//       ["blockquote", "code-block"],
//       ["link", "image", "video"],
//       ["clean"],
//     ],
//   };

//   const quillFormats = [
//     "font",
//     "size",
//     "bold",
//     "italic",
//     "underline",
//     "strike",
//     "color",
//     "background",
//     "align",
//     "list",
//     "bullet",
//     "blockquote",
//     "code-block",
//     "link",
//     "image",
//     "video",
//   ];

//   return (
//     <Card className="w-full shadow-sm">
//       <CardContent className="p-0">
//         <ContextMenu>
//           <ContextMenuTrigger>
//             <div className="min-h-64 max-h-96">
//               <QuillNoSSRWrapper
//                 value={body}
//                 onChange={setBody}
//                 className="rounded-md overflow-hidden"
//                 theme="snow"
//                 modules={quillModules}
//                 formats={quillFormats}
//                 placeholder="Start writing your content..."
//               />
//             </div>
//           </ContextMenuTrigger>
//           <ContextMenuContent className="w-48">
//             <ContextMenuItem onClick={handleContextCopy} className="gap-2">
//               Copy
//             </ContextMenuItem>
//             <ContextMenuItem onClick={handleContextPaste} className="gap-2">
//               Paste
//             </ContextMenuItem>
//             <ContextMenuItem onClick={handleContextCut} className="gap-2">
//               Cut
//             </ContextMenuItem>
//             <ContextMenuItem 
//               onClick={() => document.execCommand("bold")}
//               className="gap-2 font-bold"
//             >
//               Bold
//             </ContextMenuItem>
//             <ContextMenuItem 
//               onClick={() => document.execCommand("italic")}
//               className="gap-2 italic"
//             >
//               Italic
//             </ContextMenuItem>
//             <ContextMenuItem 
//               onClick={() => document.execCommand("underline")}
//               className="gap-2 underline"
//             >
//               Underline
//             </ContextMenuItem>
//             <ContextMenuItem 
//               onClick={() => document.execCommand("removeFormat")}
//               className="gap-2 text-red-500"
//             >
//               Clear Formatting
//             </ContextMenuItem>
//           </ContextMenuContent>
//         </ContextMenu>
//       </CardContent>
//     </Card>
//   );
// };

// export default BodyEditor;