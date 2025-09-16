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
  ...props 
}) => {
  const renderInput = () => {
switch (type) {
      case "textarea":
        return <Textarea {...props} />;
      case "select":
        return <Select {...props}>{children}</Select>;
      default:
        return <Input type={type} {...props} />;
    }
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <Label>{label}</Label>}
      {renderInput()}
      {error && (
        <p className="text-sm text-red-600 animate-slide-up">{error}</p>
      )}
    </div>
  );
};

export default FormField;