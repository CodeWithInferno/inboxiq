// "use client";

// import React, { useState } from "react";
// import { Dialog } from "@headlessui/react";
// import mammoth from "mammoth"; // For converting DOCX content to HTML

// // Helper to convert base64url to standard base64
// const base64UrlToBase64 = (base64url) => {
//   return base64url.replace(/-/g, "+").replace(/_/g, "/");
// };

// const FilePreviewMessage = ({ files }) => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [docxHtml, setDocxHtml] = useState("");

//   // Safely create a Blob URL
//   const createBlobURL = (file) => {
//     try {
//       const validBase64 = base64UrlToBase64(file.content);
//       const byteCharacters = atob(validBase64);
//       const byteNumbers = new Array(byteCharacters.length);
//       for (let i = 0; i < byteCharacters.length; i++) {
//         byteNumbers[i] = byteCharacters.charCodeAt(i);
//       }
//       const byteArray = new Uint8Array(byteNumbers);
//       const blob = new Blob([byteArray], { type: file.type });
//       return URL.createObjectURL(blob);
//     } catch (error) {
//       console.error("Error creating Blob URL:", error);
//       return null;
//     }
//   };

//   const handleDocxPreview = async (file) => {
//     const blobURL = createBlobURL(file);
//     if (!blobURL) return;

//     try {
//       const response = await fetch(blobURL);
//       const arrayBuffer = await response.arrayBuffer();
//       const result = await mammoth.convertToHtml({ arrayBuffer });
//       setDocxHtml(result.value); // HTML content with structure
//       setSelectedFile({ ...file, blobURL });
//     } catch (error) {
//       console.error("Error previewing DOCX file:", error);
//     }
//   };

//   const renderSmallPreview = (file) => {
//     const blobURL = createBlobURL(file);

//     if (!blobURL) {
//       return <span className="text-red-500 text-sm">Invalid Attachment</span>;
//     }

//     if (file.type.startsWith("image/")) {
//       return (
//         <img
//           src={blobURL}
//           alt={file.name}
//           className="h-12 w-12 object-cover rounded cursor-pointer"
//           onClick={() => setSelectedFile({ ...file, blobURL })}
//         />
//       );
//     } else if (file.type === "application/pdf") {
//       return (
//         <button
//           onClick={() => setSelectedFile({ ...file, blobURL })}
//           className="text-blue-500 underline text-sm"
//         >
//           View PDF
//         </button>
//       );
//     } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
//       return (
//         <button
//           onClick={() => handleDocxPreview(file)}
//           className="text-blue-500 underline text-sm"
//         >
//           View DOCX
//         </button>
//       );
//     } else {
//       return (
//         <a
//           href={blobURL}
//           download={file.name}
//           className="text-blue-500 underline text-sm"
//         >
//           Download {file.name}
//         </a>
//       );
//     }
//   };

//   return (
//     <div className="space-y-2">
//       {files.map((file, index) => (
//         <div
//           key={index}
//           className="flex items-center justify-between p-2 rounded hover:bg-gray-100"
//         >
//           <div className="flex items-center space-x-2">
//             {renderSmallPreview(file)}
//             <span className="text-xs text-gray-700 truncate max-w-[150px]">
//               {file.name}
//             </span>
//           </div>
//         </div>
//       ))}

//       {/* Full-screen Preview Modal */}
//       {selectedFile && (
//         <Dialog
//           open={Boolean(selectedFile)}
//           onClose={() => {
//             setSelectedFile(null);
//             setDocxHtml("");
//           }}
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
//         >
//           <div className="relative w-[90%] h-[90%] bg-white rounded-lg shadow-lg overflow-hidden">
//             <button
//               onClick={() => {
//                 setSelectedFile(null);
//                 setDocxHtml("");
//               }}
//               className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 text-2xl font-bold"
//             >
//               &times;
//             </button>
//             <div className="flex justify-center items-center w-full h-full overflow-auto p-6">
//               {selectedFile.type.startsWith("image/") && (
//                 <img
//                   src={selectedFile.blobURL}
//                   alt={selectedFile.name}
//                   className="max-w-full max-h-full object-contain"
//                 />
//               )}
//               {selectedFile.type === "application/pdf" && (
//                 <iframe
//                   src={selectedFile.blobURL}
//                   title={selectedFile.name}
//                   className="w-full h-full border-0"
//                 />
//               )}
//               {selectedFile.type ===
//                 "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && (
//                 <div
//                   className="prose max-w-full"
//                   dangerouslySetInnerHTML={{ __html: docxHtml }}
//                 />
//               )}
//               {!selectedFile.type.startsWith("image/") &&
//                 selectedFile.type !== "application/pdf" &&
//                 selectedFile.type !==
//                   "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && (
//                   <div className="text-center">
//                     <p className="text-gray-700 mb-4">
//                       Preview not available for this file type.
//                     </p>
//                     <a
//                       href={selectedFile.blobURL}
//                       download={selectedFile.name}
//                       className="text-blue-500 underline"
//                     >
//                       Download {selectedFile.name}
//                     </a>
//                   </div>
//                 )}
//             </div>
//           </div>
//         </Dialog>
//       )}
//     </div>
//   );
// };

// export default FilePreviewMessage;











"use client";

import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { renderAsync } from "docx-preview"; // Use docx-preview for DOCX rendering

// Helper to convert base64url to standard base64
const base64UrlToBase64 = (base64url) => {
  return base64url.replace(/-/g, "+").replace(/_/g, "/");
};

const FilePreviewMessage = ({ files }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [docxContainer, setDocxContainer] = useState(null);

  // Safely create a Blob URL
  const createBlobURL = (file) => {
    try {
      const validBase64 = base64UrlToBase64(file.content);
      const byteCharacters = atob(validBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: file.type });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Error creating Blob URL:", error);
      return null;
    }
  };

  // Handle DOCX Preview
  const handleDocxPreview = async (file) => {
    const blobURL = createBlobURL(file);
    if (!blobURL) return;

    try {
      const response = await fetch(blobURL);
      const arrayBuffer = await response.arrayBuffer();
      const container = document.createElement("div");
      setDocxContainer(container);
      await renderAsync(arrayBuffer, container, null, { inWrapper: false });
      setSelectedFile({ ...file, blobURL });
    } catch (error) {
      console.error("Error rendering DOCX file:", error);
      setDocxContainer(<p>Error loading DOCX preview</p>);
    }
  };

  const renderSmallPreview = (file) => {
    const blobURL = createBlobURL(file);

    if (!blobURL) {
      return <span className="text-red-500 text-sm">Invalid Attachment</span>;
    }

    if (file.type.startsWith("image/")) {
      return (
        <img
          src={blobURL}
          alt={file.name}
          className="h-12 w-12 object-cover rounded cursor-pointer"
          onClick={() => setSelectedFile({ ...file, blobURL })}
        />
      );
    } else if (file.type === "application/pdf") {
      return (
        <button
          onClick={() => setSelectedFile({ ...file, blobURL })}
          className="text-blue-500 underline text-sm"
        >
          View PDF
        </button>
      );
    } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      return (
        <button
          onClick={() => handleDocxPreview(file)}
          className="text-blue-500 underline text-sm"
        >
          View DOCX
        </button>
      );
    } else {
      return (
        <a
          href={blobURL}
          download={file.name}
          className="text-blue-500 underline text-sm"
        >
          Download {file.name}
        </a>
      );
    }
  };

  return (
    <div className="space-y-2">
      {files.map((file, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-2 rounded hover:bg-gray-100"
        >
          <div className="flex items-center space-x-2">
            {renderSmallPreview(file)}
            <span className="text-xs text-gray-700 truncate max-w-[150px]">
              {file.name}
            </span>
          </div>
        </div>
      ))}

      {/* Full-screen Preview Modal */}
      {selectedFile && (
        <Dialog
          open={Boolean(selectedFile)}
          onClose={() => {
            setSelectedFile(null);
            setDocxContainer(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
        >
          <div className="relative w-[90%] h-[90%] bg-white rounded-lg shadow-lg overflow-hidden p-4">
            <button
              onClick={() => {
                setSelectedFile(null);
                setDocxContainer(null);
              }}
              className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 text-2xl font-bold"
            >
              &times;
            </button>
            <div className="overflow-auto h-full">
              {selectedFile.type.startsWith("image/") && (
                <img
                  src={selectedFile.blobURL}
                  alt={selectedFile.name}
                  className="max-w-full max-h-full object-contain"
                />
              )}
              {selectedFile.type === "application/pdf" && (
                <iframe
                  src={selectedFile.blobURL}
                  title={selectedFile.name}
                  className="w-full h-full border-0"
                />
              )}
              {selectedFile.type ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
                docxContainer && (
                  <div className="prose max-w-full p-4">{docxContainer}</div>
                )}
              {!selectedFile.type.startsWith("image/") &&
                selectedFile.type !== "application/pdf" &&
                selectedFile.type !==
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && (
                  <div className="text-center">
                    <p className="text-gray-700 mb-4">
                      Preview not available for this file type.
                    </p>
                    <a
                      href={selectedFile.blobURL}
                      download={selectedFile.name}
                      className="text-blue-500 underline"
                    >
                      Download {selectedFile.name}
                    </a>
                  </div>
                )}
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default FilePreviewMessage;
