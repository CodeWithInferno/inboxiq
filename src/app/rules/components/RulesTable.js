// 'use client';
// import React, { useState, useEffect } from 'react';
// import { Switch } from '@headlessui/react';
// import { AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';

// const RulesTable = () => {
//   const [rules, setRules] = useState([]);
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [editingField, setEditingField] = useState(null);
//   const [newName, setNewName] = useState('');
//   const [newGroup, setNewGroup] = useState('');
//   const [newAction, setNewAction] = useState('');

//   useEffect(() => {
//     const fetchRules = async () => {
//       try {
//         const response = await fetch('/api/Rules/get-rules');
//         const data = await response.json();

//         const transformedRules = data.rules.map((rule) => ({
//           ...rule,
//           automated: rule.status || false,
//         }));

//         setRules(transformedRules);
//       } catch (error) {
//         console.error('Error fetching rules:', error);
//       }
//     };

//     fetchRules();
//   }, []);

//   const handleToggle = (index) => {
//     setRules((prevRules) =>
//       prevRules.map((rule, i) =>
//         i === index ? { ...rule, automated: !rule.automated } : rule
//       )
//     );

//     const updatedRule = rules[index];
//     const updatedStatus = !updatedRule.automated;

//     saveRuleStatus(updatedRule._id, updatedStatus);
//   };

//   const saveRuleStatus = async (ruleId, status) => {
//     try {
//       const response = await fetch(`/api/Rules/update-status`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ruleId, status }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update rule status');
//       }
//     } catch (error) {
//       console.error('Error updating rule status:', error);
//       alert('An error occurred while saving changes.');
//     }
//   };

//   const handleEdit = (index, field) => {
//     setEditingIndex(index);
//     setEditingField(field);
//     if (field === 'name') setNewName(rules[index].name || '');
//     if (field === 'group') setNewGroup(rules[index].group || '');
//     if (field === 'action') setNewAction(rules[index].action || '');
//   };

//   const handleSaveField = async (index, field) => {
//     const updatedRules = [...rules];
//     let updatedValue = '';

//     if (field === 'name') {
//       updatedRules[index].name = newName;
//       updatedValue = newName;
//     } else if (field === 'group') {
//       updatedRules[index].group = newGroup;
//       updatedValue = newGroup;
//     } else if (field === 'action') {
//       updatedRules[index].action = newAction;
//       updatedValue = newAction;
//     }

//     setRules(updatedRules);
//     setEditingIndex(null);
//     setEditingField(null);

//     try {
//       const response = await fetch(`/api/Rules/update-field`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           ruleId: rules[index]._id,
//           field,
//           value: updatedValue,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update rule');
//       }
//     } catch (error) {
//       console.error('Error updating rule:', error);
//       alert('An error occurred while saving changes.');
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md p-4 w-full">
//       <h2 className="text-lg font-semibold mb-4">Rules</h2>
//       <table className="w-full text-left">
//         <thead>
//           <tr>
//             <th className="py-2 px-4 border-b">Name</th>
//             <th className="py-2 px-4 border-b">Description</th>
//             <th className="py-2 px-4 border-b">Group</th>
//             <th className="py-2 px-4 border-b">Action</th>
//             <th className="py-2 px-4 border-b">Automated</th>
//           </tr>
//         </thead>
//         <tbody>
//           {rules.length > 0 ? (
//             rules.map((rule, index) => (
//               <tr key={rule._id}>
//                 <td className="py-2 px-4 border-b">
//                   {editingIndex === index && editingField === 'name' ? (
//                     <div className="flex items-center">
//                       <input
//                         value={newName}
//                         onChange={(e) => setNewName(e.target.value)}
//                         className="border rounded px-2 py-1"
//                         autoFocus
//                       />
//                       <button
//                         onClick={() => handleSaveField(index, 'name')}
//                         className="ml-2 text-blue-500"
//                       >
//                         Save
//                       </button>
//                     </div>
//                   ) : (
//                     <>
//                       {rule.name}
//                       <AiOutlineEdit
//                         className="ml-2 cursor-pointer text-gray-500"
//                         onClick={() => handleEdit(index, 'name')}
//                       />
//                     </>
//                   )}
//                 </td>
//                 <td className="py-2 px-4 border-b">{rule.description}</td>
//                 <td className="py-2 px-4 border-b">
//                   {editingIndex === index && editingField === 'group' ? (
//                     <div className="flex items-center">
//                       <input
//                         value={newGroup}
//                         onChange={(e) => setNewGroup(e.target.value)}
//                         className="border rounded px-2 py-1"
//                         autoFocus
//                       />
//                       <button
//                         onClick={() => handleSaveField(index, 'group')}
//                         className="ml-2 text-blue-500"
//                       >
//                         Save
//                       </button>
//                     </div>
//                   ) : (
//                     <>
//                       {rule.group}
//                       <AiOutlinePlus
//                         className="ml-2 cursor-pointer text-gray-500"
//                         onClick={() => handleEdit(index, 'group')}
//                       />
//                     </>
//                   )}
//                 </td>
//                 <td className="py-2 px-4 border-b">
//                   {editingIndex === index && editingField === 'action' ? (
//                     <div className="flex items-center">
//                       <input
//                         value={newAction}
//                         onChange={(e) => setNewAction(e.target.value)}
//                         className="border rounded px-2 py-1"
//                         autoFocus
//                       />
//                       <button
//                         onClick={() => handleSaveField(index, 'action')}
//                         className="ml-2 text-blue-500"
//                       >
//                         Save
//                       </button>
//                     </div>
//                   ) : (
//                     <>
//                       {rule.action}
//                       <AiOutlinePlus
//                         className="ml-2 cursor-pointer text-gray-500"
//                         onClick={() => handleEdit(index, 'action')}
//                       />
//                     </>
//                   )}
//                 </td>
//                 <td className="py-2 px-4 border-b text-center">
//                   <Switch
//                     checked={rule.automated}
//                     onChange={() => handleToggle(index)}
//                     className={`${
//                       rule.automated ? 'bg-blue-500' : 'bg-gray-300'
//                     } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
//                   >
//                     <span
//                       className={`${
//                         rule.automated ? 'translate-x-6' : 'translate-x-1'
//                       } inline-block h-4 w-4 transform bg-white rounded-full transition-transform`}
//                     />
//                   </Switch>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td className="py-2 px-4 border-b text-center" colSpan="5">
//                 No rules found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default RulesTable;































'use client';
import React, { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';

const RulesTable = () => {
  const [rules, setRules] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [newName, setNewName] = useState('');
  const [newGroup, setNewGroup] = useState('');
  const [newAction, setNewAction] = useState('');

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await fetch('/api/Rules/get-rules');
        const data = await response.json();

        const transformedRules = data.rules.map((rule) => ({
          ...rule,
          automated: rule.status || false,
        }));

        setRules(transformedRules);
      } catch (error) {
        console.error('Error fetching rules:', error);
      }
    };

    fetchRules();
  }, []);

  const handleToggle = (index) => {
    setRules((prevRules) =>
      prevRules.map((rule, i) =>
        i === index ? { ...rule, automated: !rule.automated } : rule
      )
    );

    const updatedRule = rules[index];
    const updatedStatus = !updatedRule.automated;

    saveRuleStatus(updatedRule._id, updatedStatus);
  };

  const saveRuleStatus = async (ruleId, status) => {
    try {
      const response = await fetch(`/api/Rules/update-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ruleId, status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update rule status');
      }
    } catch (error) {
      console.error('Error updating rule status:', error);
      alert('An error occurred while saving changes.');
    }
  };

  const handleEdit = (index, field) => {
    setEditingIndex(index);
    setEditingField(field);
    if (field === 'name') setNewName(rules[index].name || '');
    if (field === 'group') setNewGroup(rules[index].group || '');
    if (field === 'action') setNewAction(rules[index].action || '');
  };

  const handleSaveField = async (index, field) => {
    const updatedRules = [...rules];
    let updatedValue = '';

    if (field === 'name') {
      updatedRules[index].name = newName;
      updatedValue = newName;
    } else if (field === 'group') {
      updatedRules[index].group = newGroup;
      updatedValue = newGroup;
    } else if (field === 'action') {
      updatedRules[index].action = newAction;
      updatedValue = newAction;
    }

    setRules(updatedRules);
    setEditingIndex(null);
    setEditingField(null);

    try {
      const response = await fetch(`/api/Rules/update-field`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ruleId: rules[index]._id,
          field,
          value: updatedValue,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update rule');
      }
    } catch (error) {
      console.error('Error updating rule:', error);
      alert('An error occurred while saving changes.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full">
      <h2 className="text-lg font-semibold mb-4">Rules</h2>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Group</th>
            <th className="py-2 px-4 border-b">Action</th>
            <th className="py-2 px-4 border-b">Automated</th>
          </tr>
        </thead>
        <tbody>
          {rules.length > 0 ? (
            rules.map((rule, index) => (
              <tr key={rule._id}>
                <td className="py-2 px-4 border-b">
                  {editingIndex === index && editingField === 'name' ? (
                    <div className="flex items-center">
                      <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="border rounded px-2 py-1"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveField(index, 'name')}
                        className="ml-2 text-blue-500"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <>
                      {rule.name}
                      {!rule.name && (
                        <AiOutlineEdit
                          className="ml-2 cursor-pointer text-gray-500"
                          onClick={() => handleEdit(index, 'name')}
                        />
                      )}
                    </>
                  )}
                </td>
                <td className="py-2 px-4 border-b">{rule.description}</td>
                <td className="py-2 px-4 border-b">
                  {editingIndex === index && editingField === 'group' ? (
                    <div className="flex items-center">
                      <input
                        value={newGroup}
                        onChange={(e) => setNewGroup(e.target.value)}
                        className="border rounded px-2 py-1"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveField(index, 'group')}
                        className="ml-2 text-blue-500"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <>
                      {rule.group}
                      {!rule.group && (
                        <AiOutlinePlus
                          className="ml-2 cursor-pointer text-gray-500"
                          onClick={() => handleEdit(index, 'group')}
                        />
                      )}
                    </>
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  {editingIndex === index && editingField === 'action' ? (
                    <div className="flex items-center">
                      <input
                        value={newAction}
                        onChange={(e) => setNewAction(e.target.value)}
                        className="border rounded px-2 py-1"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveField(index, 'action')}
                        className="ml-2 text-blue-500"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <>
                      {rule.action}
                      {!rule.action && (
                        <AiOutlinePlus
                          className="ml-2 cursor-pointer text-gray-500"
                          onClick={() => handleEdit(index, 'action')}
                        />
                      )}
                    </>
                  )}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <Switch
                    checked={rule.automated}
                    onChange={() => handleToggle(index)}
                    className={`${
                      rule.automated ? 'bg-blue-500' : 'bg-gray-300'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                  >
                    <span
                      className={`${
                        rule.automated ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform bg-white rounded-full transition-transform`}
                    />
                  </Switch>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="py-2 px-4 border-b text-center" colSpan="5">
                No rules found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RulesTable;
