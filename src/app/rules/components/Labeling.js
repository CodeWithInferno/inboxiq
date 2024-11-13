// // src/components/Labeling.js

// 'use client';
// import React, { useState, useEffect } from 'react';
// import { AiOutlineDelete } from 'react-icons/ai';

// const Labeling = () => {
//   const [label, setLabel] = useState('');
//   const [color, setColor] = useState('#000000');
//   const [labels, setLabels] = useState([]);

//   useEffect(() => {
//     fetchLabels();
//   }, []);

//   const fetchLabels = async () => {
//     try {
//       const response = await fetch('/api/Rules/labels/get-labels');
//       const data = await response.json();
//       setLabels(data.labels);
//     } catch (error) {
//       console.error('Error fetching labels:', error);
//     }
//   };

//   const handleAddLabel = async () => {
//     if (!label) return;

//     try {
//       const response = await fetch('/api/Rules/labels/add-label', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ label, color }),
//       });
//       if (response.ok) {
//         fetchLabels(); // Refresh the labels list
//         setLabel(''); // Clear input field
//         setColor('#000000'); // Reset color
//       } else {
//         alert('Failed to add label');
//       }
//     } catch (error) {
//       console.error('Error adding label:', error);
//     }
//   };

//   const handleDeleteLabel = async (labelId) => {
//     try {
//       const response = await fetch(`/api/Rules/labels/delete-label`, {
//         method: 'DELETE',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ labelId }),
//       });
//       if (response.ok) {
//         fetchLabels(); // Refresh labels after deletion
//       } else {
//         alert('Failed to delete label');
//       }
//     } catch (error) {
//       console.error('Error deleting label:', error);
//     }
//   };

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md w-full">
//       <h2 className="text-lg font-semibold mb-4">Manage Labels</h2>
//       <div className="flex space-x-2 mb-4">
//         <input
//           type="text"
//           value={label}
//           onChange={(e) => setLabel(e.target.value)}
//           placeholder="Label name"
//           className="border p-2 rounded flex-1"
//         />
//         <input
//           type="color"
//           value={color}
//           onChange={(e) => setColor(e.target.value)}
//           className="w-12 h-10 p-0 border rounded"
//         />
//         <button
//           onClick={handleAddLabel}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Add Label
//         </button>
//       </div>
//       <ul className="space-y-2">
//         {labels.map((item) => (
//           <li
//             key={item._id}
//             className="flex items-center justify-between p-2 border rounded"
//           >
//             <span
//               style={{ color: item.color }}
//               className="font-semibold"
//             >
//               {item.label}
//             </span>
//             <AiOutlineDelete
//               onClick={() => handleDeleteLabel(item._id)}
//               className="text-red-500 cursor-pointer hover:text-red-700"
//               title="Delete label"
//               style={{ fontSize: '1.25rem', marginLeft: '8px' }}
//             />
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Labeling;


























// src/components/Labeling.js

'use client';
import React, { useState, useEffect } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';

const Labeling = () => {
  const [label, setLabel] = useState('');
  const [color, setColor] = useState('#000000');
  const [labels, setLabels] = useState([]);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchLabels();
    fetchCategories();
  }, []);

  const fetchLabels = async () => {
    try {
      const response = await fetch('/api/Rules/labels/get-labels');
      const data = await response.json();
      setLabels(data.labels);
    } catch (error) {
      console.error('Error fetching labels:', error);
    }
  };

  const handleAddLabel = async () => {
    if (!label) return;

    try {
      const response = await fetch('/api/Rules/labels/add-label', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label, color }),
      });
      if (response.ok) {
        fetchLabels(); // Refresh the labels list
        setLabel(''); // Clear input field
        setColor('#000000'); // Reset color
      } else {
        alert('Failed to add label');
      }
    } catch (error) {
      console.error('Error adding label:', error);
    }
  };

  const handleDeleteLabel = async (labelId) => {
    try {
      const response = await fetch(`/api/Rules/labels/delete-label`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ labelId }),
      });
      if (response.ok) {
        fetchLabels(); // Refresh labels after deletion
      } else {
        alert('Failed to delete label');
      }
    } catch (error) {
      console.error('Error deleting label:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/Rules/categories/get-categories');
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddCategory = async () => {
    if (!category) return;

    try {
      const response = await fetch('/api/Rules/categories/add-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category }),
      });
      if (response.ok) {
        fetchCategories(); // Refresh the categories list
        setCategory(''); // Clear input field
      } else {
        alert('Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const response = await fetch(`/api/Rules/categories/delete-category`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId }),
      });
      if (response.ok) {
        fetchCategories(); // Refresh categories after deletion
      } else {
        alert('Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full">
      <h2 className="text-lg font-semibold mb-4">Manage Labels</h2>
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Label name"
          className="border p-2 rounded flex-1"
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-12 h-10 p-0 border rounded"
        />
        <button
          onClick={handleAddLabel}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Label
        </button>
      </div>
      <ul className="space-y-2">
        {labels.map((item) => (
          <li
            key={item._id}
            className="flex items-center bg-white text-black justify-between p-2 border rounded"
          >
            <span
              style={{ color: item.color }}
              className="font-semibold"
            >
              {item.label}
            </span>
            <AiOutlineDelete
              onClick={() => handleDeleteLabel(item._id)}
              className="text-red-500 cursor-pointer hover:text-red-700"
              title="Delete label"
              style={{ fontSize: '1.25rem', marginLeft: '8px' }}
            />
          </li>
        ))}
      </ul>

      {/* Category Management */}
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md w-full">
        <h2 className="text-lg font-semibold mb-4">Manage Categories</h2>
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category name"
            className="border p-2 rounded flex-1"
          />
          <button
            onClick={handleAddCategory}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Category
          </button>
        </div>
        <ul className="space-y-2">
          {categories.map((item) => (
            <li
              key={item._id}
              className="flex items-center justify-between p-2 border rounded"
            >
              <span className="font-semibold">{item.category}</span>
              <AiOutlineDelete
                onClick={() => handleDeleteCategory(item._id)}
                className="text-red-500 cursor-pointer hover:text-red-700"
                title="Delete category"
                style={{ fontSize: '1.25rem', marginLeft: '8px' }}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Labeling;
