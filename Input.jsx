import React from 'react';

const Input = ({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const inputId = id || name;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg shadow-xs transition duration-150 focus:outline-none focus:ring-2 disabled:bg-slate-100 disabled:cursor-not-allowed ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-200 text-red-900 placeholder-red-300'
            : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 text-slate-800 placeholder-slate-400'
        }`}
        {...props}
      />
      {error ? (
        <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Input;
