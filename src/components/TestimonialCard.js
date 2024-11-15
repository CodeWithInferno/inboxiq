// TestimonialCard.js

const TestimonialCard = ({ text, name, username, imageUrl }) => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between">
        <p className="text-gray-700 from-neutral-700 to-slate-950 text-balance mb-4">{text}</p>
        <div className="flex items-center mt-auto">
          <img src={imageUrl} alt={name} className="w-10 h-10 rounded-full object-cover" />
          <div className="ml-3">
            <p className="text-sm font-semibold">{name}</p>
            <p className="text-xs text-gray-500">{username}</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default TestimonialCard;
  