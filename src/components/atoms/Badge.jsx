import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = "default", 
  size = "default",
  children, 
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full";
  
  const variants = {
    default: "bg-surface-100 text-surface-800 border border-surface-200",
    success: "bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 border border-emerald-200",
    warning: "bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 border border-amber-200",
    danger: "bg-gradient-to-r from-red-100 to-red-50 text-red-800 border border-red-200",
    info: "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200",
    primary: "bg-gradient-to-r from-primary-100 to-primary-50 text-primary-800 border border-primary-200"
  };
  
  const sizes = {
    small: "px-2 py-0.5 text-xs",
    default: "px-3 py-1 text-sm",
    large: "px-4 py-1.5 text-base"
  };
  
  return (
    <span
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";
export default Badge;