// src/components/SkeletonGridItem.js

import React from 'react';
import '../styles/SkeletonGridItem.css';

const SkeletonGridItem = () => {
  return (
    <div className="skeleton-grid-item">
      <div className="skeleton-image"></div>
      <div className="skeleton-text skeleton-title"></div>
      <div className="skeleton-text skeleton-subtitle"></div>
      <div className="skeleton-text skeleton-id"></div>
    </div>
  );
};

export default SkeletonGridItem;
