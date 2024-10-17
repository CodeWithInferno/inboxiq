// app/dashboard/components/SendMessageForm.js
const SendMessageForm = ({ message, handleChange, handleSubmit }) => {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="to"
          placeholder="Recipient's Email"
          value={message.to}
          onChange={handleChange}
          className="p-2 border rounded w-full"
          required
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={message.subject}
          onChange={handleChange}
          className="p-2 border rounded w-full"
          required
        />
        <textarea
          name="body"
          placeholder="Message Body"
          value={message.body}
          onChange={handleChange}
          className="p-2 border rounded w-full"
          rows="4"
          required
        ></textarea>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Send Message
        </button>
      </form>
    );
  };
  
  export default SendMessageForm;
  