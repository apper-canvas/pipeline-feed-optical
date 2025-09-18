import React from "react";
import Textarea from "@/components/atoms/Textarea";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
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
    switch (type) {
      case 'textarea':
        return <Textarea {...props} value={value} onChange={onChange} />;
      
      case 'select':
        return (
          <Select {...props} value={value} onChange={onChange}>
            {children}
          </Select>
        );
      
      case 'multipicklist':
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto border border-slate-300 rounded-lg p-2">
              {options?.map((option) => (
                <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={value?.includes(option.value)}
                    onChange={(e) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      if (e.target.checked) {
                        onChange([...currentValues, option.value]);
                      } else {
                        onChange(currentValues.filter(v => v !== option.value));
                      }
                    }}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
                  />
                  <span className="text-sm text-slate-700">{option.label}</span>
                </label>
              ))}
            </div>
            {value && value.length > 0 && (
              <div className="text-xs text-slate-500">
                Selected: {Array.isArray(value) ? value.join(', ') : value}
              </div>
            )}
          </div>
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {options?.map((option) => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={props.name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => onChange(option.value)}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <span className="text-sm text-slate-700">{option.label}</span>
              </label>
            ))}
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {options?.map((option) => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={option.value}
                  checked={value?.includes(option.value)}
                  onChange={(e) => {
                    const newValue = value || [];
                    if (e.target.checked) {
                      onChange([...newValue, option.value]);
                    } else {
                      onChange(newValue.filter(v => v !== option.value));
                    }
                  }}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
                />
                <span className="text-xs text-slate-700">{option.label}</span>
              </label>
            ))}
          </div>
        );
      
      case 'boolean':
        return (
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => onChange(!value)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                value ? 'bg-emerald-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  value ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-sm text-slate-700">
              {value ? 'Yes' : 'No'}
            </span>
          </div>
        );
      
      case 'rating':
        return (
          <div className="flex items-center space-x-1 star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => onChange(star)}
                className="star-icon focus:outline-none"
              >
                <svg
                  className={`h-6 w-6 ${
                    star <= (value || 0) ? 'text-yellow-400 fill-current' : 'text-slate-300'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </button>
            ))}
            <span className="text-sm text-slate-500 ml-2">
              {value ? `${value}/5` : '0/5'}
            </span>
          </div>
        );
      
      case 'currency':
        return (
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
            <Input
              {...props}
              type="text"
              value={value}
              onChange={onChange}
              className="currency-input"
              placeholder="0"
            />
          </div>
        );
      
      case 'website':
        return (
          <div className="relative">
            <Input
              {...props}
              type="url"
              value={value}
              onChange={onChange}
              className="pl-3"
              placeholder="https://example.com"
            />
          </div>
        );
      
      default:
        return <Input type={type} {...props} value={value} onChange={onChange} />;
    }
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