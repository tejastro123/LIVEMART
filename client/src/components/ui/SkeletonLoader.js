import React from 'react';

const SkeletonLoader = ({ type = 'text', height, width, count = 1, style }) => {
  const skeletons = Array(count).fill(0);

  const getStyles = () => {
    const baseStyles = {
      backgroundColor: 'var(--bg-tertiary)',
      borderRadius: 'var(--radius-sm)',
      animation: 'shimmer 1.5s infinite linear',
      background: 'linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-secondary) 50%, var(--bg-tertiary) 75%)',
      backgroundSize: '200% 100%',
      marginBottom: 'var(--space-2)',
      ...style
    };

    if (type === 'text') {
      return { ...baseStyles, height: height || '1rem', width: width || '100%' };
    }
    if (type === 'rect') {
      return { ...baseStyles, height: height || '100px', width: width || '100%' };
    }
    if (type === 'circle') {
      return { ...baseStyles, height: height || '48px', width: width || '48px', borderRadius: '50%' };
    }
    if (type === 'card') {
      return { ...baseStyles, height: height || '200px', width: width || '100%', borderRadius: 'var(--radius-lg)' };
    }
    return baseStyles;
  };

  return (
    <>
      {skeletons.map((_, index) => (
        <div key={index} className="skeleton-loader" style={getStyles()} />
      ))}
    </>
  );
};

export default SkeletonLoader;
