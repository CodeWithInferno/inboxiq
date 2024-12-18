const FormattingToolbar = ({ applyFormat }) => (
    <div className="flex space-x-2 mb-2 bg-gray-200 p-2 rounded-md">
      <button type="button" onClick={() => applyFormat('bold')} title="Bold" className="p-1 hover:bg-gray-300 rounded"><FaBold /></button>
      <button type="button" onClick={() => applyFormat('italic')} title="Italic" className="p-1 hover:bg-gray-300 rounded"><FaItalic /></button>
      <button type="button" onClick={() => applyFormat('underline')} title="Underline" className="p-1 hover:bg-gray-300 rounded"><FaUnderline /></button>
      <button type="button" onClick={() => applyFormat('insertOrderedList')} title="Numbered List" className="p-1 hover:bg-gray-300 rounded"><FaListOl /></button>
      <button type="button" onClick={() => applyFormat('insertUnorderedList')} title="Bullet List" className="p-1 hover:bg-gray-300 rounded"><FaListUl /></button>
      <button type="button" onClick={() => applyFormat('justifyLeft')} title="Align Left" className="p-1 hover:bg-gray-300 rounded"><FaAlignLeft /></button>
      <button type="button" onClick={() => applyFormat('justifyCenter')} title="Align Center" className="p-1 hover:bg-gray-300 rounded"><FaAlignCenter /></button>
      <button type="button" onClick={() => applyFormat('justifyRight')} title="Align Right" className="p-1 hover:bg-gray-300 rounded"><FaAlignRight /></button>
      <button type="button" onClick={() => applyFormat('formatBlock', 'H2')} title="Heading" className="p-1 hover:bg-gray-300 rounded"><FaHeading /></button>
    </div>
  );
  
  export default FormattingToolbar;
  