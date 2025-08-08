import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";

const MetricModal = ({ isOpen, onClose, onSubmit, metric = null }) => {
  const [formData, setFormData] = useState({
    type: "blood_pressure",
    value: "",
    unit: "",
    date: "",
    time: "",
    notes: ""
  });

  const metricTypes = [
    { value: "blood_pressure", label: "Blood Pressure", unit: "mmHg", placeholder: "120/80" },
    { value: "glucose", label: "Blood Glucose", unit: "mg/dL", placeholder: "100" },
    { value: "weight", label: "Weight", unit: "lbs", placeholder: "150" },
    { value: "temperature", label: "Temperature", unit: "°F", placeholder: "98.6" },
    { value: "heart_rate", label: "Heart Rate", unit: "bpm", placeholder: "70" }
  ];

  useEffect(() => {
    if (metric) {
      setFormData({
        type: metric.type || "blood_pressure",
        value: metric.value || "",
        unit: metric.unit || "",
        date: metric.date || "",
        time: metric.time || "",
        notes: metric.notes || ""
      });
    } else {
      const today = new Date();
      const currentDate = today.toISOString().split("T")[0];
      const currentTime = today.toTimeString().slice(0, 5);
      
      setFormData({
        type: "blood_pressure",
        value: "",
        unit: "mmHg",
        date: currentDate,
        time: currentTime,
        notes: ""
      });
    }
  }, [metric, isOpen]);

  useEffect(() => {
    const selectedType = metricTypes.find(type => type.value === formData.type);
    if (selectedType) {
      setFormData(prev => ({ ...prev, unit: selectedType.unit }));
    }
  }, [formData.type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const getSelectedType = () => {
    return metricTypes.find(type => type.value === formData.type);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-display text-surface-900">
              {metric ? "Edit Health Metric" : "Add Health Metric"}
            </h2>
            <Button variant="ghost" onClick={onClose} className="p-2">
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="Metric Type"
              type="select"
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={metricTypes.map(type => ({
                value: type.value,
                label: type.label
              }))}
            />

            <FormField
              label={`Value (${formData.unit})`}
              required
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              placeholder={getSelectedType()?.placeholder}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Date"
                type="input"
                inputType="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />

              <FormField
                label="Time"
                type="input"
                inputType="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>

            <FormField
              label="Notes (Optional)"
              type="custom"
            >
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="flex min-h-[80px] w-full rounded-lg border-2 border-surface-200 bg-white px-3 py-2 text-sm font-medium text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 resize-none"
                placeholder="Any additional notes..."
                rows={3}
              />
            </FormField>

            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {metric ? "Update Metric" : "Add Metric"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default MetricModal;