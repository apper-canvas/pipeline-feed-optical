import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "flex h-10 w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-8 text-sm text-slate-900",
          "focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
          "transition-all duration-200",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ApperIcon
        name="ChevronDown"
        className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none"
      />
    </div>
  );
});

Select.displayName = "Select";

export default Select;