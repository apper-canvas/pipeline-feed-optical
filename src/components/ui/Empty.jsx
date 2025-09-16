import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  description = "There's nothing to show here yet.",
  action,
  actionLabel = "Get Started",
  icon = "Inbox"
}) => {
  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-8 text-center">
        <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name={icon} className="h-8 w-8 text-slate-400" />
        </div>
        
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 mb-6">{description}</p>
        
        {action && (
          <Button onClick={action} className="w-full">
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Empty;