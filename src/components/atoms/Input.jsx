import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text", 
  error,
  disabled,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-lg border-2 border-surface-200 bg-white px-3 py-2 text-sm font-medium text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
        error && "border-red-500 focus:border-red-500 focus:ring-red-100",
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    />
  );
});

Input.displayName = "Input";
export default Input;