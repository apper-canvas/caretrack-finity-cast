import React from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <Card className="p-8 text-center max-w-md mx-auto">
      <div className="mb-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertCircle" size={32} className="text-red-600" />
        </div>
      </div>
      
      <h3 className="text-lg font-bold font-display text-surface-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-surface-600 mb-6">{message}</p>
      
      {onRetry && (
        <Button onClick={onRetry} variant="primary" className="w-full">
          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
          Try Again
        </Button>
      )}
    </Card>
  );
};

export default Error;