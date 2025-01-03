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





























// "use client";

// import React, { useState } from "react";
// import { Dialog } from "@headlessui/react";

// const FilePreview = ({ files, onRemove }) => {
//   const [selectedFile, setSelectedFile] = useState(null);

//   // Renders file preview (image, PDF, text)
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
//         <button
//           onClick={() => setSelectedFile(file)}
//           className="text-blue-500 underline text-sm"
//         >
//           View PDF
//         </button>
//       );
//     } else if (file.type.startsWith("text/")) {
//       return (
//         <button
//           onClick={() => setSelectedFile(file)}
//           className="text-gray-600 truncate text-sm"
//         >
//           {atob(file.content).slice(0, 20)}...
//         </button>
//       );
//     }
//     return <span className="text-gray-500 text-sm">Unsupported File</span>;
//   };

//   return (
//     <div className="space-y-2">
//       {/* File List */}
//       {files.map((file, index) => (
//         <div
//           key={index}
//           className="flex items-center justify-between p-2 rounded hover:bg-gray-100"
//         >
//           <div className="flex items-center space-x-2">
//             {renderFilePreview(file)}
//             <span className="text-xs text-gray-700 truncate max-w-[150px]">
//               {file.name}
//             </span>
//           </div>
//           <button
//             type="button"
//             onClick={() => onRemove(index)}
//             className="text-red-500 hover:text-red-700 text-xs"
//           >
//             Remove
//           </button>
//         </div>
//       ))}

//       {/* Full-Screen Popup */}
//       {selectedFile && (
//         <Dialog
//           open={Boolean(selectedFile)}
//           onClose={() => setSelectedFile(null)}
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
//         >
//           <div className="relative w-[90%] h-[90%] bg-white rounded-lg shadow-lg overflow-hidden">
//             {/* Close Button */}
//             <button
//               onClick={() => setSelectedFile(null)}
//               className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 text-2xl font-bold"
//             >
//               &times;
//             </button>

//             {/* File Content */}
//             <div className="flex justify-center items-center w-full h-full overflow-auto">
//               {selectedFile.type.startsWith("image/") && (
//                 <img
//                   src={`data:${selectedFile.type};base64,${selectedFile.content}`}
//                   alt={selectedFile.name}
//                   className="max-w-full max-h-full object-contain"
//                 />
//               )}
//               {selectedFile.type === "application/pdf" && (
//                 <iframe
//                   src={`data:${selectedFile.type};base64,${selectedFile.content}`}
//                   title={selectedFile.name}
//                   className="w-full h-full border-0"
//                 />
//               )}
//               {selectedFile.type.startsWith("text/") && (
//                 <pre className="p-4 text-sm text-gray-800 whitespace-pre-wrap">
//                   {atob(selectedFile.content)}
//                 </pre>
//               )}
//               {!selectedFile.type.startsWith("image/") &&
//                 !selectedFile.type.startsWith("text/") &&
//                 selectedFile.type !== "application/pdf" && (
//                   <span className="text-gray-500">Unsupported file type</span>
//                 )}
//             </div>
//           </div>
//         </Dialog>
//       )}
//     </div>
//   );
// };

// export default FilePreview;













'use client';

import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { X, File, FileText, Image as ImageIcon, Plus, Minus, Download, RotateCw } from "lucide-react";

const FilePreview = ({ files, onRemove }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);

  const getFileIcon = (fileType) => {
    if (fileType.startsWith("image/")) {
      return <ImageIcon className="w-5 h-5 text-blue-500" />;
    } else if (fileType === "application/pdf") {
      return <File className="w-5 h-5 text-red-500" />;
    } else if (fileType.startsWith("text/")) {
      return <FileText className="w-5 h-5 text-green-500" />;
    }
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const renderFilePreview = (file) => {
    if (file.type.startsWith("image/")) {
      return (
        <div className="group relative">
          <div className="overflow-hidden rounded-lg">
            <img
              src={`data:${file.type};base64,${file.content}`}
              alt={file.name}
              className="h-16 w-16 object-cover cursor-pointer 
                       transform transition-all duration-300 
                       group-hover:scale-110"
              onClick={() => {
                setSelectedFile(file);
                setZoomLevel(100);
                setRotation(0);
              }}
            />
          </div>
          <div 
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0
                      opacity-0 group-hover:opacity-100 transition-all duration-300
                      rounded-lg flex items-center justify-center cursor-pointer"
            onClick={() => setSelectedFile(file)}
          >
            <span className="text-white text-xs font-medium px-3 py-1 bg-black/30 
                           rounded-full backdrop-blur-sm">
              Preview
            </span>
          </div>
        </div>
      );
    }
    
    return (
      <button
        onClick={() => setSelectedFile(file)}
        className="flex items-center space-x-2 px-4 py-2.5 rounded-lg
                   bg-gradient-to-b from-white to-gray-50
                   border border-gray-200 hover:border-gray-300
                   shadow-sm hover:shadow transition-all duration-200"
      >
        {getFileIcon(file.type)}
        <span className="text-sm font-medium text-gray-700">
          {file.type === "application/pdf" ? "View PDF" : "View Content"}
        </span>
      </button>
    );
  };

  return (
    <div className="space-y-4">
      {files.map((file, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 rounded-xl
                     bg-white border border-gray-200 
                     shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center space-x-4">
            {renderFilePreview(file)}
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-800 truncate max-w-[200px]">
                {file.name}
              </span>
              <span className="text-xs text-gray-500 mt-0.5">
                {(file.size / 1024).toFixed(1)} KB • {file.type.split('/')[1].toUpperCase()}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-2 rounded-full hover:bg-red-50 group 
                     transition-all duration-200 outline-none
                     focus:ring-2 focus:ring-red-100"
          >
            <X className="w-4 h-4 text-gray-400 group-hover:text-red-500 
                         transition-colors duration-200" />
          </button>
        </div>
      ))}

      {selectedFile && (
        <Dialog
          open={Boolean(selectedFile)}
          onClose={() => setSelectedFile(null)}
          className="fixed inset-0 z-50"
        >
          <div className="fixed inset-0 bg-gray-900/98 backdrop-blur-sm transition-opacity" />
          
          <div className="fixed inset-0 overflow-hidden">
            {/* Header Toolbar */}
            <div className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-200 z-10">
              <div className="max-w-screen-xl mx-auto">
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-800">
                      {selectedFile.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium
                                   bg-gray-100 text-gray-600">
                      {zoomLevel}%
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={handleZoomOut}
                      disabled={zoomLevel <= 50}
                      className="p-2 rounded-lg hover:bg-gray-100/80 
                               transition-all duration-200 disabled:opacity-50
                               focus:outline-none focus:ring-2 focus:ring-gray-200"
                    >
                      <Minus className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={handleZoomIn}
                      disabled={zoomLevel >= 200}
                      className="p-2 rounded-lg hover:bg-gray-100/80 
                               transition-all duration-200 disabled:opacity-50
                               focus:outline-none focus:ring-2 focus:ring-gray-200"
                    >
                      <Plus className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={handleRotate}
                      className="p-2 rounded-lg hover:bg-gray-100/80 
                               transition-all duration-200
                               focus:outline-none focus:ring-2 focus:ring-gray-200"
                    >
                      <RotateCw className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={() => {/* Add download functionality */}}
                      className="p-2 rounded-lg hover:bg-gray-100/80 
                               transition-all duration-200
                               focus:outline-none focus:ring-2 focus:ring-gray-200"
                    >
                      <Download className="w-5 h-5 text-gray-700" />
                    </button>
                    <div className="w-px h-6 bg-gray-200 mx-2" />
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="p-2 rounded-lg hover:bg-gray-100/80 
                               transition-all duration-200
                               focus:outline-none focus:ring-2 focus:ring-gray-200"
                    >
                      <X className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="h-full pt-[56px] flex items-center justify-center">
              <div className="relative w-full h-full flex items-center justify-center p-4">
                {selectedFile.type.startsWith("image/") && (
                  <img
                    src={`data:${selectedFile.type};base64,${selectedFile.content}`}
                    alt={selectedFile.name}
                    style={{
                      transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain'
                    }}
                    className="rounded-lg shadow-2xl"
                  />
                )}
                {selectedFile.type === "application/pdf" && (
                  <iframe
                    src={`data:${selectedFile.type};base64,${selectedFile.content}`}
                    title={selectedFile.name}
                    className="w-full h-full border-0 rounded-lg shadow-2xl"
                  />
                )}
                {selectedFile.type.startsWith("text/") && (
                  <div className="bg-white rounded-lg shadow-2xl p-8 max-w-3xl w-full">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                      {atob(selectedFile.content)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default FilePreview;