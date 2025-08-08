import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import AppointmentCard from "@/components/molecules/AppointmentCard";
import AppointmentModal from "@/components/organisms/AppointmentModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import { format, isToday, isFuture, isPast } from "date-fns";
import appointmentService from "@/services/api/appointmentService";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [viewType, setViewType] = useState("upcoming");

  const loadAppointments = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await appointmentService.getAll();
      setAppointments(data);
    } catch (err) {
      setError("Failed to load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      if (editingAppointment) {
        await appointmentService.update(editingAppointment.Id, formData);
        toast.success("Appointment updated successfully!");
      } else {
        await appointmentService.create(formData);
        toast.success("Appointment scheduled successfully!");
      }
      
      setShowModal(false);
      setEditingAppointment(null);
      loadAppointments();
    } catch (error) {
      toast.error("Failed to save appointment. Please try again.");
    }
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setShowModal(true);
  };

  const handleCancel = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      await appointmentService.delete(appointmentId);
      toast.success("Appointment cancelled successfully!");
      loadAppointments();
    } catch (error) {
      toast.error("Failed to cancel appointment. Please try again.");
    }
  };

  const getFilteredAppointments = () => {
    const now = new Date();
    
    switch (viewType) {
      case "today":
        return appointments.filter(app => isToday(new Date(app.date)));
      case "upcoming":
        return appointments
          .filter(app => isFuture(new Date(app.date)) || isToday(new Date(app.date)))
          .sort((a, b) => new Date(a.date) - new Date(b.date));
      case "past":
        return appointments
          .filter(app => isPast(new Date(app.date)) && !isToday(new Date(app.date)))
          .sort((a, b) => new Date(b.date) - new Date(a.date));
      default:
        return appointments.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadAppointments} />;

  const filteredAppointments = getFilteredAppointments();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-surface-900">Appointments</h1>
          <p className="text-surface-600 mt-1">Schedule and manage your healthcare appointments</p>
        </div>
        
        <Button 
          onClick={() => {
            setEditingAppointment(null);
            setShowModal(true);
          }}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={20} />
          <span>Schedule Appointment</span>
        </Button>
      </div>

      {/* View Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={viewType === "today" ? "primary" : "outline"}
          size="small"
          onClick={() => setViewType("today")}
        >
          <ApperIcon name="Calendar" size={16} className="mr-2" />
          Today
        </Button>
        <Button
          variant={viewType === "upcoming" ? "primary" : "outline"}
          size="small"
          onClick={() => setViewType("upcoming")}
        >
          <ApperIcon name="Clock" size={16} className="mr-2" />
          Upcoming
        </Button>
        <Button
          variant={viewType === "past" ? "primary" : "outline"}
          size="small"
          onClick={() => setViewType("past")}
        >
          <ApperIcon name="History" size={16} className="mr-2" />
          Past
        </Button>
        <Button
          variant={viewType === "all" ? "primary" : "outline"}
          size="small"
          onClick={() => setViewType("all")}
        >
          <ApperIcon name="List" size={16} className="mr-2" />
          All ({appointments.length})
        </Button>
      </div>

      {/* Quick Stats */}
      {viewType === "upcoming" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-25 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <ApperIcon name="Calendar" size={24} className="text-blue-600" />
              <div>
                <p className="text-sm text-blue-700 font-medium">Today's Appointments</p>
                <p className="text-2xl font-bold text-blue-900">
                  {appointments.filter(app => isToday(new Date(app.date))).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-25 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <ApperIcon name="Clock" size={24} className="text-emerald-600" />
              <div>
                <p className="text-sm text-emerald-700 font-medium">This Week</p>
                <p className="text-2xl font-bold text-emerald-900">
                  {appointments.filter(app => {
                    const appDate = new Date(app.date);
                    const weekFromNow = new Date();
                    weekFromNow.setDate(weekFromNow.getDate() + 7);
                    return appDate >= new Date() && appDate <= weekFromNow;
                  }).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-25 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <ApperIcon name="Users" size={24} className="text-purple-600" />
              <div>
                <p className="text-sm text-purple-700 font-medium">Total Upcoming</p>
                <p className="text-2xl font-bold text-purple-900">
                  {appointments.filter(app => isFuture(new Date(app.date)) || isToday(new Date(app.date))).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <Empty
          title={
            viewType === "today" ? "No appointments today" :
            viewType === "past" ? "No past appointments" :
            "No appointments found"
          }
          message={
            viewType === "today" ? "You have a clear schedule for today" :
            viewType === "past" ? "Your appointment history will appear here" :
            "Schedule your first healthcare appointment to get started"
          }
          icon="Calendar"
          actionLabel="Schedule Appointment"
          onAction={() => {
            setEditingAppointment(null);
            setShowModal(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.Id}
              appointment={appointment}
              onEdit={handleEdit}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingAppointment(null);
        }}
        onSubmit={handleSubmit}
        appointment={editingAppointment}
      />
    </div>
  );
};

export default Appointments;