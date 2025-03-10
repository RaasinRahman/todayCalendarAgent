import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "default",
      size = "default",
      isLoading = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = "font-medium rounded-md focus:outline-none transition-colors";
    
    const variants = {
      default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
      outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
    };
    
    const sizes = {
      default: "px-4 py-2 text-sm",
      sm: "px-3 py-1.5 text-xs",
      lg: "px-6 py-3 text-base",
    };
    
    const variantStyles = variants[variant];
    const sizeStyles = sizes[size];
    
    const buttonStyles = `${baseStyles} ${variantStyles} ${sizeStyles} ${className} ${
      props.disabled ? "opacity-50 cursor-not-allowed" : ""
    } ${isLoading ? "relative !text-transparent" : ""}`;

    return (
      <button
        className={buttonStyles}
        ref={ref}
        disabled={props.disabled || isLoading}
        {...props}
      >
        {children}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };