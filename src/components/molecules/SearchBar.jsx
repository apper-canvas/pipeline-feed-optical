import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";

const SearchBar = ({ 
  placeholder = "Search...", 
  value, 
  onChange, 
  className,
  ...props 
}) => {
  return (
    <div className={cn("relative", className)}>
      <ApperIcon
        name="Search"
        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400"
      />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-10"
        {...props}
      />
    </div>
  );
};

export default SearchBar;