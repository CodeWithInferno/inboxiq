'use client';

import { FaPaperclip } from "react-icons/fa";
import FilePreview from "./FilePreview";

const Attachments = ({ attachments, handleFileChange, handleRemoveAttachment }) => {
  return (
    <div>
      <label className="flex items-center space-x-2 cursor-pointer">
        <FaPaperclip className="text-gray-500 hover:text-gray-800" />
        <span className="text-sm text-gray-600">Attach Files</span>
        <input type="file" multiple className="hidden" onChange={handleFileChange} />
      </label>
      <FilePreview files={attachments} onRemove={handleRemoveAttachment} />
    </div>
  );
};

export default Attachments;
