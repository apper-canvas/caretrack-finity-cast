import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";

const MedicationModal = ({ isOpen, onClose, onSubmit, medication = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "",
    times: [""],
    startDate: "",
    endDate: "",
    refillDate: "",
    notes: ""
  });

  useEffect(() => {
    if (medication) {
      setFormData({
        name: medication.name || "",
        dosage: medication.dosage || "",
        frequency: medication.frequency || "",
        times: medication.times || [""],
        startDate: medication.startDate || "",
        endDate: medication.endDate || "",
        refillDate: medication.refillDate || "",
        notes: medication.notes || ""
      });
    } else {
      setFormData({
        name: "",
        dosage: "",
        frequency: "Daily",
        times: ["08:00"],
        startDate: "",
        endDate: "",
        refillDate: "",
        notes: ""
      });
    }
  }, [medication, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      times: formData.times.filter(time => time.trim() !== "")
    });
    onClose();
  };

  const addTimeSlot = () => {
    setFormData({
      ...formData,
      times: [...formData.times, ""]
    });
  };

  const removeTimeSlot = (index) => {
    const newTimes = formData.times.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      times: newTimes
    });
  };

  const updateTimeSlot = (index, value) => {
    const newTimes = [...formData.times];
    newTimes[index] = value;
    setFormData({
      ...formData,
      times: newTimes
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-display text-surface-900">
              {medication ? "Edit Medication" : "Add Medication"}
            </h2>
            <Button variant="ghost" onClick={onClose} className="p-2">
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                label="Medication Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Aspirin"
              />

              <FormField
                label="Dosage"
                required
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                placeholder="e.g., 100mg"
              />
            </div>

            <FormField
              label="Frequency"
              type="select"
              required
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              options={[
                { value: "Once daily", label: "Once daily" },
                { value: "Twice daily", label: "Twice daily" },
                { value: "Three times daily", label: "Three times daily" },
                { value: "Four times daily", label: "Four times daily" },
                { value: "As needed", label: "As needed" }
              ]}
            />

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-surface-700">
                Daily Times <span className="text-red-500">*</span>
              </label>
              {formData.times.map((time, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => updateTimeSlot(index, e.target.value)}
                    className="flex h-11 w-full rounded-lg border-2 border-surface-200 bg-white px-3 py-2 text-sm font-medium text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100"
                    required
                  />
                  {formData.times.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="small"
                      onClick={() => removeTimeSlot(index)}
                      className="p-2 text-red-600 hover:bg-red-50"
                    >
                      <ApperIcon name="X" size={16} />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="small"
                onClick={addTimeSlot}
                className="flex items-center space-x-2"
              >
                <ApperIcon name="Plus" size={16} />
                <span>Add Time</span>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                label="Start Date"
                type="input"
                inputType="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />

              <FormField
                label="End Date (Optional)"
                type="input"
                inputType="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>

            <FormField
              label="Refill Date"
              type="input"
              inputType="date"
              value={formData.refillDate}
              onChange={(e) => setFormData({ ...formData, refillDate: e.target.value })}
            />

            <FormField
              label="Notes (Optional)"
              type="custom"
            >
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="flex min-h-[80px] w-full rounded-lg border-2 border-surface-200 bg-white px-3 py-2 text-sm font-medium text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 resize-none"
                placeholder="Any special instructions..."
                rows={3}
              />
            </FormField>

            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {medication ? "Update Medication" : "Add Medication"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default MedicationModal;