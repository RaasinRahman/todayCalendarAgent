import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
          text-gray-900 font-medium placeholder-indigo-400
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
          transition-all duration-200 ease-in-out
          ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""} 
          ${className}`}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };