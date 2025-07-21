import React from 'react';

const Sidebar = ({ sections, onAdd }) => (
  <div className="w-1/4 border-r p-4">
    {sections.map(section => (
      <div
        key={section.id}
        className="p-2 mb-2 bg-gray-100 cursor-pointer hover:bg-gray-200"
        onClick={() => onAdd(section)}
      >
        {section.name}
      </div>
    ))}
  </div>
);

export default Sidebar;
