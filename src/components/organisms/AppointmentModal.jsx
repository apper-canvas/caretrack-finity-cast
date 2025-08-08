import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";

const AppointmentModal = ({ isOpen, onClose, onSubmit, appointment = null }) => {
  const [formData, setFormData] = useState({
    title: "",
    provider: "",
    location: "",
    date: "",
    time: "",
    type: "routine",
    notes: ""
  });

  useEffect(() => {
    if (appointment) {
      setFormData({
        title: appointment.title || "",
        provider: appointment.provider || "",
        location: appointment.location || "",
        date: appointment.date || "",
        time: appointment.time || "",
        type: appointment.type || "routine",
        notes: appointment.notes || ""
      });
    } else {
      setFormData({
        title: "",
        provider: "",
        location: "",
        date: "",
        time: "",
        type: "routine",
        notes: ""
      });
    }
  }, [appointment, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-display text-surface-900">
              {appointment ? "Edit Appointment" : "Add Appointment"}
            </h2>
            <Button variant="ghost" onClick={onClose} className="p-2">
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="Appointment Title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Annual Checkup"
            />

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                label="Healthcare Provider"
                required
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                placeholder="e.g., Dr. Smith"
              />

              <FormField
                label="Location"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Main Medical Center"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
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
              label="Appointment Type"
              type="select"
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={[
                { value: "routine", label: "Routine Checkup" },
                { value: "followup", label: "Follow-up" },
                { value: "urgent", label: "Urgent Care" },
                { value: "specialist", label: "Specialist Visit" },
                { value: "lab", label: "Lab Work" }
              ]}
            />

            <FormField
              label="Notes (Optional)"
              type="custom"
            >
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="flex min-h-[80px] w-full rounded-lg border-2 border-surface-200 bg-white px-3 py-2 text-sm font-medium text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 resize-none"
                placeholder="Any special instructions or reminders..."
                rows={3}
              />
            </FormField>

            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {appointment ? "Update Appointment" : "Add Appointment"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default AppointmentModal;