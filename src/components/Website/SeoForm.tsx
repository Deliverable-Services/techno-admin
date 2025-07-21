import React from 'react';

const SeoForm = ({ seoDetails }) => {
  return (
    <div className="space-y-4">
      <div>
        <label>Meta Title</label>
        <input value={seoDetails.metaTitle} readOnly className="border p-2 w-full" />
      </div>
      <div>
        <label>Meta Description</label>
        <textarea value={seoDetails.metaDescription} readOnly className="border p-2 w-full" />
      </div>
      <div>
        <label>Meta Keywords</label>
        <input value={seoDetails.metaKeywords.join(', ')} readOnly className="border p-2 w-full" />
      </div>
      <div>
        <label>Social Featured Image</label>
        <img src={seoDetails.socialFeaturedImage} alt="SEO Featured" className="w-48 mt-2" />
      </div>
    </div>
  );
};

export default SeoForm;
