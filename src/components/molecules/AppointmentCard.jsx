import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const AppointmentCard = ({ appointment, onEdit, onCancel }) => {
  const getTypeColor = (type) => {
    const colors = {
      "routine": "primary",
      "followup": "info",
      "urgent": "warning",
      "specialist": "secondary",
      "lab": "success"
    };
    return colors[type.toLowerCase()] || "default";
  };

  const getTypeIcon = (type) => {
    const icons = {
      "routine": "Calendar",
      "followup": "RefreshCw",
      "urgent": "AlertCircle",
      "specialist": "UserCheck",
      "lab": "TestTube"
    };
    return icons[type.toLowerCase()] || "Calendar";
  };

  const isUpcoming = new Date(appointment.date) > new Date();
  const isToday = format(new Date(appointment.date), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  return (
    <Card hover className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl">
            <ApperIcon name={getTypeIcon(appointment.type)} size={24} className="text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-display text-surface-900">{appointment.title}</h3>
            <p className="text-sm text-surface-600">{appointment.provider}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={getTypeColor(appointment.type)}>
            {appointment.type}
          </Badge>
          {isToday && (
            <Badge variant="warning">Today</Badge>
          )}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Calendar" size={16} className="text-surface-500" />
          <span className="text-sm text-surface-700">
            {format(new Date(appointment.date), "EEEE, MMMM dd, yyyy")}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <ApperIcon name="Clock" size={16} className="text-surface-500" />
          <span className="text-sm text-surface-700">{appointment.time}</span>
        </div>
        <div className="flex items-center space-x-2">
          <ApperIcon name="MapPin" size={16} className="text-surface-500" />
          <span className="text-sm text-surface-700">{appointment.location}</span>
        </div>
      </div>

      {appointment.notes && (
        <div className="mb-4 p-3 bg-surface-50 rounded-lg">
          <p className="text-sm text-surface-700">{appointment.notes}</p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          size="small"
          onClick={() => onEdit?.(appointment)}
        >
          <ApperIcon name="Edit2" size={16} className="mr-2" />
          Edit
        </Button>
        {isUpcoming && (
          <Button
            variant="danger"
            size="small"
            onClick={() => onCancel?.(appointment.Id)}
          >
            <ApperIcon name="X" size={16} className="mr-2" />
            Cancel
          </Button>
        )}
      </div>
    </Card>
  );
};

export default AppointmentCard;