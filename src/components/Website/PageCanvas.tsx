import React from 'react';

const PageCanvas = ({ sections }) => (
  <div className="space-y-4">
    {sections.map((section, idx) => (
      <div key={section.id} className="p-4 border rounded bg-white">
        <h4 className="font-bold">{section.name}</h4>
        <p>{section.json.variables?.title}</p>
        <p>{section.json.variables?.description}</p>
        {section.json.variables?.featuredImage && (
          <img
            src={section.json.variables.featuredImage}
            alt="Preview"
            className="w-32 mt-2"
          />
        )}
      </div>
    ))}
  </div>
);

export default PageCanvas;
