
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
  const [labels, setLabels] = useState([]);
  const [labelEditIndex, setLabelEditIndex] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryDropdownIndex, setCategoryDropdownIndex] = useState(null);

  useEffect(() => {
    fetchRules();
    fetchLabels();
    fetchCategories();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await fetch('/api/Rules/get-rules');
      const data = await response.json();
      const transformedRules = data.rules.map((rule) => ({
        ...rule,
        automated: rule.status || false,
        tags: rule.tags || [],
      }));
      setRules(transformedRules);
    } catch (error) {
      console.error('Error fetching rules:', error);
    }
  };

  const fetchLabels = async () => {
    try {
      const response = await fetch('/api/Rules/labels/get-labels');
      const data = await response.json();
      setLabels(data.labels);
    } catch (error) {
      console.error('Error fetching labels:', error);
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

  const handleSaveField = async (index, field, value) => {
    const updatedRules = [...rules];

    if (field === 'name') {
      updatedRules[index].name = value || newName;
    } else if (field === 'group') {
      updatedRules[index].group = value || newGroup;
    } else if (field === 'action') {
      updatedRules[index].action = value || newAction;
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
          value: value || updatedRules[index][field],
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

  const handleLabelSelect = (ruleIndex, label) => {
    const updatedRules = [...rules];
    const selectedRule = updatedRules[ruleIndex];

    if (!selectedRule.tags.find((tag) => tag._id === label._id)) {
      selectedRule.tags = [...(selectedRule.tags || []), label];
      setRules(updatedRules);

      saveLabelsForRule(selectedRule._id, selectedRule.tags);
    }
  };

  const saveLabelsForRule = async (ruleId, tags) => {
    try {
      await fetch('/api/Rules/update-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ruleId, tags }),
      });
    } catch (error) {
      console.error('Error updating tags:', error);
    }
  };

  const handleCategorySelect = (ruleIndex, category) => {
    const updatedRules = [...rules];
    updatedRules[ruleIndex].category = category.category;
    setRules(updatedRules);
    setCategoryDropdownIndex(null);
    handleSaveField(ruleIndex, 'group', category.category);
  };

  const handleRemoveTag = async (ruleIndex, tagId) => {
    const updatedRules = [...rules];
    const selectedRule = updatedRules[ruleIndex];

    // Filter out the tag to be removed
    selectedRule.tags = selectedRule.tags.filter((tag) => tag._id !== tagId);
    setRules(updatedRules);

    // Update the database
    try {
      await saveLabelsForRule(selectedRule._id, selectedRule.tags);
    } catch (error) {
      console.error('Error removing tag:', error);
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
                  {categoryDropdownIndex === index ? (
                    <div className="relative">
                      <div className="absolute bg-white text-black border rounded shadow-lg p-2 mt-2 z-10 w-48">
                        {categories.map((category) => (
                          <div
                            key={category._id}
                            className="p-2 cursor-pointer hover:bg-gray-100 text-black"
                            onClick={() => handleCategorySelect(index, category)}
                          >
                            {category.category}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => setCategoryDropdownIndex(index)}
                    >
                      {rule.group || 'Select Category'}
                      <AiOutlineEdit className="ml-2 text-gray-500" />
                    </div>
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  <div className="flex items-center space-x-2">
                    {rule.tags?.map((tag) => (
                      <span
                        key={tag._id}
                        style={{ color: tag.color, borderColor: tag.color }}
                        className="text-xs font-semibold border rounded-full px-2 py-1 flex items-center space-x-1"
                      >
                        {tag.label}
                        <button
                          className="text-red-500 ml-1"
                          onClick={() => handleRemoveTag(index, tag._id)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <AiOutlinePlus
                      className="cursor-pointer text-gray-500"
                      onClick={() => setLabelEditIndex(index)}
                    />
                  </div>
                  {labelEditIndex === index && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {labels.map((label) => (
                        <button
                          key={label._id}
                          onClick={() => handleLabelSelect(index, label)}
                          className="text-xs font-semibold px-2 py-1 rounded-full border"
                          style={{ color: label.color, borderColor: label.color }}
                        >
                          {label.label}
                        </button>
                      ))}
                    </div>
                  )}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <Switch
                    checked={rule.automated}
                    onChange={() => handleToggle(index)}
                    className={`${rule.automated ? 'bg-blue-500' : 'bg-gray-300'
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                  >
                    <span
                      className={`${rule.automated ? 'translate-x-6' : 'translate-x-1'
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
