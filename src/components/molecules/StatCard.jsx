import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon, 
  className 
}) => {
  const changeColors = {
    positive: "text-emerald-600",
    negative: "text-red-600",
    neutral: "text-slate-500"
  };

  const changeIcons = {
    positive: "TrendingUp",
    negative: "TrendingDown",
    neutral: "Minus"
  };

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            {change && (
              <div className={cn("flex items-center space-x-1 text-sm", changeColors[changeType])}>
                <ApperIcon name={changeIcons[changeType]} className="h-4 w-4" />
                <span>{change}</span>
              </div>
            )}
          </div>
          {icon && (
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center">
              <ApperIcon name={icon} className="h-6 w-6 text-white" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;