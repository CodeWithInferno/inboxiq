// const HtmlEditor = ({ htmlInput, setHtmlInput, showHtmlPopup, setShowHtmlPopup }) => (
//     <Dialog open={showHtmlPopup} onOpenChange={setShowHtmlPopup}>
//       <Draggable bounds="parent" handle=".drag-handle">
//         <DialogContent className="max-w-md w-full rounded-lg shadow-xl bg-white p-4 z-50 border border-gray-200">
//           <div className="flex justify-between items-center drag-handle cursor-move p-2 bg-gray-100 rounded-t-lg">
//             <h2 className="text-lg font-semibold text-gray-700">HTML Editor</h2>
//             <DialogClose asChild>
//             </DialogClose>
//           </div>
//           <div className="p-4">
//             <textarea
//               value={htmlInput}
//               onChange={(e) => setHtmlInput(DOMPurify.sanitize(e.target.value.trim()))}
//               placeholder="Edit HTML here..."
//               className="w-full p-3 border rounded-lg h-64 resize-none bg-gray-50 shadow-inner"
//             />
//           </div>
//         </DialogContent>
//       </Draggable>
//     </Dialog>
//   );

  

//   export default HtmlEditor;