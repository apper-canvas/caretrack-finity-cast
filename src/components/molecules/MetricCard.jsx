import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const MetricCard = ({ metric, onEdit, onDelete }) => {
  const getMetricIcon = (type) => {
    const icons = {
      "blood_pressure": "Heart",
      "glucose": "Droplet",
      "weight": "Scale",
      "temperature": "Thermometer",
      "heart_rate": "Activity"
    };
    return icons[type] || "Activity";
  };

  const getMetricColor = (type) => {
    const colors = {
      "blood_pressure": "from-red-500 to-red-600",
      "glucose": "from-blue-500 to-blue-600",
      "weight": "from-emerald-500 to-emerald-600",
      "temperature": "from-orange-500 to-orange-600",
      "heart_rate": "from-purple-500 to-purple-600"
    };
    return colors[type] || "from-gray-500 to-gray-600";
  };

  const metricType = metric.type_c || metric.type;
  const metricValue = metric.value_c || metric.value;
  const metricUnit = metric.unit_c || metric.unit;
  const metricDate = metric.date_c || metric.date;
  const metricTime = metric.time_c || metric.time;
  const metricNotes = metric.notes_c || metric.notes;

  const formatValue = (value, type) => {
    if (type === "blood_pressure") {
      return value; // Assuming format like "120/80"
    }
    return `${value} ${metricUnit}`;
  };

  const formatDateTime = () => {
    const date = new Date(metricDate);
    if (metricTime) {
      const [hours, minutes] = metricTime.split(':');
      date.setHours(parseInt(hours), parseInt(minutes));
    }
    return format(date, "MMM dd, yyyy 'at' h:mm a");
  };

  return (
    <Card hover className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 bg-gradient-to-br ${getMetricColor(metricType)} rounded-xl`}>
            <ApperIcon name={getMetricIcon(metricType)} size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-display text-surface-900 capitalize">
              {metricType?.replace("_", " ")}
            </h3>
            <p className="text-2xl font-bold text-primary-600">
              {formatValue(metricValue, metricType)}
            </p>
          </div>
        </div>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="small"
            onClick={() => onEdit?.(metric)}
            className="p-2"
          >
            <ApperIcon name="Edit2" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="small"
            onClick={() => onDelete?.(metric.Id)}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-surface-600">Recorded:</span>
          <span className="text-sm font-medium text-surface-700">
            {formatDateTime()}
          </span>
        </div>
        {metricNotes && (
          <div className="mt-3 p-3 bg-surface-50 rounded-lg">
            <p className="text-sm text-surface-700">{metricNotes}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MetricCard;