// "use client";

// import React, { useState } from "react";
// import { Dialog, DialogTrigger, DialogContent, DialogClose } from "@/components/ui/dialog";

// const FilePreview = ({ files, onRemove }) => {
//   const [selectedFile, setSelectedFile] = useState(null);

//   const renderFilePreview = (file) => {
//     if (file.type.startsWith("image/")) {
//       return (
//         <img
//           src={`data:${file.type};base64,${file.content}`}
//           alt={file.name}
//           className="h-12 w-12 object-cover rounded cursor-pointer"
//           onClick={() => setSelectedFile(file)}
//         />
//       );
//     } else if (file.type === "application/pdf") {
//       return (
//         <span
//           className="text-sm text-blue-500 underline cursor-pointer"
//           onClick={() => setSelectedFile(file)}
//         >
//           View PDF
//         </span>
//       );
//     } else if (file.type.startsWith("text/")) {
//       return (
//         <span
//           className="text-sm text-gray-600 truncate cursor-pointer"
//           onClick={() => setSelectedFile(file)}
//         >
//           {atob(file.content).slice(0, 20)}...
//         </span>
//       );
//     } else {
//       return <span className="text-gray-500">Unsupported File</span>;
//     }
//   };

//   return (
//     <div className="space-y-2">
//       {files.map((file, index) => (
//         <div
//           key={index}
//           className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
//           onClick={() => setSelectedFile(file)}
//         >
//           <div className="flex items-center space-x-2">
//             {renderFilePreview(file)}
//             <span className="text-xs text-gray-700 truncate max-w-[150px]">
//               {file.name}
//             </span>
//           </div>
//           <button
//             type="button"
//             onClick={(e) => {
//               e.stopPropagation();
//               onRemove(index);
//             }}
//             className="text-red-500 hover:text-red-700 text-xs"
//           >
//             Remove
//           </button>
//         </div>
//       ))}

//       {/* Full-Screen Centered File Popup */}
//       {selectedFile && (
//         <Dialog open={Boolean(selectedFile)} onOpenChange={() => setSelectedFile(null)}>
//           <DialogContent
//             className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80"
//             onEscapeKeyDown={() => setSelectedFile(null)}
//           >
//             <div className="relative w-full max-w-4xl h-full max-h-[90%] bg-white shadow-lg rounded-lg flex flex-col overflow-hidden">
//               <div className="absolute top-2 right-2">
//                 <DialogClose asChild>
//                   <button
//                     className="text-black text-2xl font-bold hover:text-gray-700"
//                     aria-label="Close"
//                   >
//                     &times;
//                   </button>
//                 </DialogClose>
//               </div>
//               <div className="flex justify-center items-center flex-1 overflow-auto p-4">
//                 {selectedFile.type.startsWith("image/") && (
//                   <img
//                     src={`data:${selectedFile.type};base64,${selectedFile.content}`}
//                     alt={selectedFile.name}
//                     className="max-w-full max-h-full object-contain"
//                   />
//                 )}
//                 {selectedFile.type === "application/pdf" && (
//                   <iframe
//                     src={`data:${selectedFile.type};base64,${selectedFile.content}`}
//                     title={selectedFile.name}
//                     className="w-full h-full border-0"
//                   ></iframe>
//                 )}
//                 {selectedFile.type.startsWith("text/") && (
//                   <pre className="p-4 w-full h-full overflow-auto text-sm text-gray-800">
//                     {atob(selectedFile.content)}
//                   </pre>
//                 )}
//                 {!selectedFile.type.startsWith("image/") &&
//                   !selectedFile.type.startsWith("text/") &&
//                   selectedFile.type !== "application/pdf" && (
//                     <span className="text-gray-500">Unsupported file type</span>
//                   )}
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>
//       )}
//     </div>
//   );
// };

// export default FilePreview;





























"use client";

import React, { useState } from "react";
import { Dialog } from "@headlessui/react";

const FilePreview = ({ files, onRemove }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const renderFilePreview = (file) => {
    if (file.type.startsWith("image/")) {
      return (
        <img
          src={`data:${file.type};base64,${file.content}`}
          alt={file.name}
          className="h-12 w-12 object-cover rounded cursor-pointer"
          onClick={() => setSelectedFile(file)}
        />
      );
    } else if (file.type === "application/pdf") {
      return (
        <button
          onClick={() => setSelectedFile(file)}
          className="text-blue-500 underline text-sm"
        >
          View PDF
        </button>
      );
    } else if (file.type.startsWith("text/")) {
      return (
        <button
          onClick={() => setSelectedFile(file)}
          className="text-gray-600 truncate text-sm"
        >
          {atob(file.content).slice(0, 20)}...
        </button>
      );
    }
    return <span className="text-gray-500 text-sm">Unsupported File</span>;
  };

  return (
    <div className="space-y-2">
      {files.map((file, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-2 rounded hover:bg-gray-100"
        >
          <div className="flex items-center space-x-2">
            {renderFilePreview(file)}
            <span className="text-xs text-gray-700 truncate max-w-[150px]">
              {file.name}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-red-500 hover:text-red-700 text-xs"
          >
            Remove
          </button>
        </div>
      ))}

      {selectedFile && (
        <Dialog
          open={Boolean(selectedFile)}
          onClose={() => setSelectedFile(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
        >
          <div className="relative w-[90%] h-[90%] bg-white rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => setSelectedFile(null)}
              className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 text-2xl font-bold"
            >
              &times;
            </button>
            <div className="flex justify-center items-center w-full h-full overflow-auto">
              {selectedFile.type.startsWith("image/") && (
                <img
                  src={`data:${selectedFile.type};base64,${selectedFile.content}`}
                  alt={selectedFile.name}
                  className="max-w-full max-h-full object-contain"
                />
              )}
              {selectedFile.type === "application/pdf" && (
                <iframe
                  src={`data:${selectedFile.type};base64,${selectedFile.content}`}
                  title={selectedFile.name}
                  className="w-full h-full border-0"
                />
              )}
              {selectedFile.type.startsWith("text/") && (
                <pre className="p-4 text-sm text-gray-800 whitespace-pre-wrap">
                  {atob(selectedFile.content)}
                </pre>
              )}
              {!selectedFile.type.startsWith("image/") &&
                !selectedFile.type.startsWith("text/") &&
                selectedFile.type !== "application/pdf" && (
                  <span className="text-gray-500">Unsupported file type</span>
                )}
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};


export default FilePreview;
