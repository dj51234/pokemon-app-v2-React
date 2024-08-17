// src/components/SkeletonSetItem.js

import React from 'react';
import '../styles/SkeletonGridItem.css'; // Reuse the same CSS for the shimmer effect

const SkeletonSetItem = () => {
  return (
    <div className="skeleton-grid-item"> 
      <div className="skeleton-image"></div>
    </div>
  );
};

export default SkeletonSetItem;
