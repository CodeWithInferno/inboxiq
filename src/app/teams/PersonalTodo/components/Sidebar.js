'use client';

export default function Sidebar() {
  const categories = [
    { title: 'This Week', tasks: [] },
    { title: 'This Month', tasks: [] },
    { title: 'Personal', tasks: [] },
  ];

  return (
    <div className="bg-gray-900 text-white w-64 p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-6">Todos</h2>
        {categories.map((category, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
