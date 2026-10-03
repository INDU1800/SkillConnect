import React from 'react';

const Select = ({
  label,
  id,
  name,
  value,
  onChange,
  options = [],
  error,
  required = false,
  disabled = false,
  className = '',
  placeholder = 'Select an option',
  ...props
}) => {
  const selectId = id || name;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg shadow-xs transition duration-150 focus:outline-none focus:ring-2 disabled:bg-slate-100 disabled:cursor-not-allowed ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-200 text-red-900'
            : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 text-slate-800'
        }`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => {
          const optValue = typeof opt === 'object' ? opt.value : opt;
          const optLabel = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={optValue} value={optValue}>
              {optLabel}
            </option>
          );
        })}
      </select>
      {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};

export default Select;
