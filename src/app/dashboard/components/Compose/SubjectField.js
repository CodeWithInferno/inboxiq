'use client';

const SubjectField = ({ message, handleChange }) => {
  return (
    <input
      type="text"
      name="subject"
      placeholder="Subject"
      value={message.subject}
      onChange={handleChange}
      className="p-2 border bg-white rounded w-full"
      required
    />
  );
};

export default SubjectField;
