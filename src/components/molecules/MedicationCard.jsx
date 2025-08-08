import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const MedicationCard = ({ medication, logs = [], onLogTaken, onEdit }) => {
  const todayLogs = logs.filter(log => 
    log.medicationId === medication.Id && 
    format(new Date(), "yyyy-MM-dd") === format(new Date(log.date), "yyyy-MM-dd")
  );

  const getNextDose = () => {
    const now = new Date();
    const currentTime = format(now, "HH:mm");
    
    return medication.times.find(time => time > currentTime) || medication.times[0];
  };

  const getDoseStatus = (time) => {
    const log = todayLogs.find(log => log.scheduledTime === time);
    if (!log) return "pending";
    return log.status;
  };

  const getPillColor = (index) => {
    const colors = [
      "bg-gradient-to-br from-blue-400 to-blue-500",
      "bg-gradient-to-br from-emerald-400 to-emerald-500",
      "bg-gradient-to-br from-purple-400 to-purple-500",
      "bg-gradient-to-br from-amber-400 to-amber-500",
      "bg-gradient-to-br from-rose-400 to-rose-500"
    ];
    return colors[index % colors.length];
  };

  return (
    <Card hover className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-8 rounded-full ${getPillColor(medication.Id)} shadow-lg flex items-center justify-center`}>
            <div className="w-8 h-6 bg-white bg-opacity-20 rounded-full"></div>
          </div>
          <div>
            <h3 className="text-lg font-bold font-display text-surface-900">{medication.name}</h3>
            <p className="text-sm text-surface-600">{medication.dosage}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="small"
          onClick={() => onEdit?.(medication)}
          className="p-2"
        >
          <ApperIcon name="Edit2" size={16} />
        </Button>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-surface-700">Next dose:</span>
          <span className="text-sm font-bold text-primary-600">{getNextDose()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-surface-700">Frequency:</span>
          <span className="text-sm text-surface-600">{medication.frequency}</span>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-surface-700">Today's Schedule</h4>
        <div className="flex flex-wrap gap-2">
          {medication.times.map((time, index) => {
            const status = getDoseStatus(time);
            return (
              <div key={index} className="flex items-center space-x-2">
                <Badge
                  variant={
                    status === "taken" ? "success" :
                    status === "missed" ? "danger" :
                    "default"
                  }
                >
                  {time}
                </Badge>
                {status === "pending" && (
                  <Button
                    variant="success"
                    size="small"
                    onClick={() => onLogTaken?.(medication.Id, time)}
                    className="px-2 py-1 text-xs"
                  >
                    <ApperIcon name="Check" size={12} className="mr-1" />
                    Take
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {medication.refillDate && new Date(medication.refillDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
        <div className="mt-4 p-3 bg-gradient-to-r from-amber-50 to-amber-25 border border-amber-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <ApperIcon name="AlertTriangle" size={16} className="text-amber-600" />
            <span className="text-sm font-medium text-amber-800">
              Refill needed by {format(new Date(medication.refillDate), "MMM dd")}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default MedicationCard;