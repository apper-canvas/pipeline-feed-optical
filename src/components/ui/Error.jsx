import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong", 
  onRetry,
  title = "Error"
}) => {
  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-8 text-center">
        <div className="mb-4">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="AlertTriangle" className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
          <p className="text-slate-600 mb-6">{message}</p>
        </div>
        
        {onRetry && (
          <Button onClick={onRetry} className="w-full">
            <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Error;