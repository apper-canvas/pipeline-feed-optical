import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  type = "text", 
  error, 
  className, 
  children,
  options = [],
  value,
  onChange,
  ...props 
}) => {
  const renderInput = () => {
const renderInput = () => {
    switch (type) {
      case "textarea":
        return <Textarea {...props} />;
      case "select":
        return <Select {...props}>{children}</Select>;
      case "checkbox":
        return (
          <div className="space-y-2">
            {options.map((option) => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={Array.isArray(value) ? value.includes(option.value) : false}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    if (e.target.checked) {
                      onChange([...currentValues, option.value]);
                    } else {
                      onChange(currentValues.filter(v => v !== option.value));
                    }
                  }}
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );
      case "radio":
        return (
          <div className="space-y-2">
            {options.map((option) => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={props.name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );
      case "rating":
        return (
          <div className="star-rating flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => onChange(star)}
                className="star-icon p-1 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <svg
                  className={`w-6 h-6 ${
                    star <= (value || 0) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {value ? `${value}/5` : 'No rating'}
            </span>
          </div>
        );
      case "currency":
        return (
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              $
            </span>
            <Input
              {...props}
              type="number"
              step="0.01"
              min="0"
              value={value}
              onChange={onChange}
              className="currency-input"
            />
          </div>
        );
      case "website":
        return <Input type="url" {...props} value={value} onChange={onChange} />;
      default:
        return <Input type={type} {...props} value={value} onChange={onChange} />;
    }
  };
  };

  return (
<div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      {renderInput()}
      {error && (
        <p className="text-sm text-red-600 animate-slide-up">{error}</p>
      )}
    </div>
  );
};

export default FormField;