import React, { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  error, 
  type = 'text', 
  placeholder, 
  className = '',
  icon: Icon,
  disabled = false,
  ...props 
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className={`block text-sm font-medium ${disabled ? 'text-gray-500' : 'text-gray-700'}`}>
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={`h-5 w-5 ${disabled ? 'text-gray-300' : 'text-gray-400'}`} />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm
            placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
            focus:border-transparent transition-all duration-200
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
