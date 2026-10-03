import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeMap = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div
        className={`${sizeMap[size] || sizeMap.md} animate-spin rounded-full border-indigo-600 border-t-transparent`}
      ></div>
      {text && <p className="text-sm font-medium text-slate-500">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
