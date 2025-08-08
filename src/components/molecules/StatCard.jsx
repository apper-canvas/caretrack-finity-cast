import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend,
  trendDirection,
  color = "primary",
  className 
}) => {
  const colorClasses = {
    primary: {
      icon: "bg-gradient-to-br from-primary-500 to-primary-600 text-white",
      trend: trendDirection === "up" ? "text-emerald-600" : trendDirection === "down" ? "text-red-600" : "text-surface-500"
    },
    success: {
      icon: "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white",
      trend: "text-emerald-600"
    },
    warning: {
      icon: "bg-gradient-to-br from-amber-500 to-amber-600 text-white",
      trend: "text-amber-600"
    },
    danger: {
      icon: "bg-gradient-to-br from-red-500 to-red-600 text-white",
      trend: "text-red-600"
    }
  };

  return (
    <Card hover className={cn("p-6", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-surface-600">{title}</p>
          <p className="text-3xl font-bold font-display text-surface-900">{value}</p>
          {trend && (
            <div className="flex items-center space-x-1">
              <ApperIcon 
                name={trendDirection === "up" ? "TrendingUp" : trendDirection === "down" ? "TrendingDown" : "Minus"} 
                size={16} 
                className={colorClasses[color].trend}
              />
              <span className={cn("text-sm font-medium", colorClasses[color].trend)}>
                {trend}
              </span>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", colorClasses[color].icon)}>
          <ApperIcon name={icon} size={24} />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;