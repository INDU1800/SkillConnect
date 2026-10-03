import React from 'react';
import Button from './Button';

const EmptyState = ({
  icon: Icon,
  title = 'No items found',
  description = 'There are no items to display at this moment.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="text-center py-12 px-4 bg-white rounded-xl border border-dashed border-slate-300 max-w-lg mx-auto my-6">
      {Icon && (
        <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600 mb-4">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-5 max-w-sm mx-auto">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
