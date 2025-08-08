import React from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No items found", 
  message = "Get started by adding your first item", 
  icon = "Plus",
  actionLabel = "Add Item",
  onAction 
}) => {
  return (
    <Card className="p-12 text-center max-w-lg mx-auto">
      <div className="mb-6">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-100 to-primary-50 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} size={40} className="text-primary-600" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold font-display text-surface-900 mb-3">
        {title}
      </h3>
      
      <p className="text-surface-600 mb-8 leading-relaxed">
        {message}
      </p>
      
      {onAction && (
        <Button onClick={onAction} variant="primary" size="large">
          <ApperIcon name={icon} size={20} className="mr-2" />
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};

export default Empty;