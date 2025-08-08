import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { format, isToday, isTomorrow } from "date-fns";
import medicationService from "@/services/api/medicationService";
import medicationLogService from "@/services/api/medicationLogService";
import appointmentService from "@/services/api/appointmentService";
import healthMetricService from "@/services/api/healthMetricService";
import ApperIcon from "@/components/ApperIcon";
import MedicationCard from "@/components/molecules/MedicationCard";
import StatCard from "@/components/molecules/StatCard";
import AppointmentCard from "@/components/molecules/AppointmentCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Dashboard = () => {
  const [medications, setMedications] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [medicationLogs, setMedicationLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [medsData, appsData, metricsData, logsData] = await Promise.all([
        medicationService.getAll(),
        appointmentService.getAll(),
        healthMetricService.getAll(),
        medicationLogService.getAll()
      ]);
      
      setMedications(medsData);
      setAppointments(appsData);
      setMetrics(metricsData);
      setMedicationLogs(logsData);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogMedication = async (medicationId, scheduledTime) => {
    try {
const newLog = {
        medication_id_c: parseInt(medicationId),
        scheduled_time_c: scheduledTime,
        taken_time_c: format(new Date(), "HH:mm"),
        status_c: "taken",
        date_c: format(new Date(), "yyyy-MM-dd")
      };
      await medicationLogService.create(newLog);
      const updatedLogs = await medicationLogService.getAll();
      setMedicationLogs(updatedLogs);
      
      toast.success("Medication logged successfully!");
    } catch (error) {
      toast.error("Failed to log medication. Please try again.");
    }
  };

  if (loading) return <Loading type="stats" />;
  if (error) return <Error message={error} onRetry={loadData} />;

// Filter medications with times and handle database field structure
  const todayMedications = medications.filter(med => {
    const times = typeof med.times_c === 'string' ? 
      med.times_c.split(',').map(t => t.trim()).filter(t => t) : 
      (med.times_c || med.times || []);
    return times.length > 0;
  }).slice(0, 3);
  
  const todayAppointments = appointments.filter(app => 
    isToday(new Date(app.date_c || app.date))
  );
  
  const upcomingAppointments = appointments
    .filter(app => {
      const appDate = new Date(app.date_c || app.date);
      return appDate >= new Date() && !isToday(appDate);
    })
    .sort((a, b) => new Date(a.date_c || a.date) - new Date(b.date_c || b.date))
    .slice(0, 2);
    
  const recentMetrics = metrics
    .sort((a, b) => new Date(b.date_c || b.date) - new Date(a.date_c || a.date))
    .slice(0, 3);

  const getTodayMedicationAdherence = () => {
    const todayLogs = medicationLogs.filter(log => 
      format(new Date(), "yyyy-MM-dd") === format(new Date(log.date_c || log.date), "yyyy-MM-dd")
    );
    const takenLogs = todayLogs.filter(log => (log.status_c || log.status) === "taken");
    
    const totalScheduled = medications.reduce((sum, med) => {
      const times = typeof med.times_c === 'string' ? 
        med.times_c.split(',').map(t => t.trim()).filter(t => t) : 
        (med.times_c || med.times || []);
      return sum + times.length;
    }, 0);
    
    if (totalScheduled === 0) return 0;
    return Math.round((takenLogs.length / totalScheduled) * 100);
  };

const getNextAppointment = () => {
    const upcoming = appointments
      .filter(app => new Date(app.date_c || app.date) >= new Date())
      .sort((a, b) => new Date(a.date_c || a.date) - new Date(b.date_c || b.date))[0];
    
    if (!upcoming) return "None scheduled";
    const upcomingDate = new Date(upcoming.date_c || upcoming.date);
    if (isToday(upcomingDate)) return "Today";
    if (isTomorrow(upcomingDate)) return "Tomorrow";
    return format(upcomingDate, "MMM dd");
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-display mb-2">
              Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening"}!
            </h1>
            <p className="text-primary-100 text-lg">
              {format(new Date(), "EEEE, MMMM dd, yyyy")}
            </p>
          </div>
          <div className="hidden md:block">
            <ApperIcon name="Heart" size={64} className="text-primary-200" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Adherence"
          value={`${getTodayMedicationAdherence()}%`}
          icon="Target"
          trend={getTodayMedicationAdherence() >= 80 ? "Great!" : "Needs attention"}
          trendDirection={getTodayMedicationAdherence() >= 80 ? "up" : "down"}
          color={getTodayMedicationAdherence() >= 80 ? "success" : "warning"}
        />
        <StatCard
          title="Active Medications"
          value={medications.length}
          icon="Pill"
          color="primary"
        />
        <StatCard
          title="Next Appointment"
          value={getNextAppointment()}
          icon="Calendar"
          color="primary"
        />
        <StatCard
          title="Health Metrics"
          value={recentMetrics.length}
          icon="Activity"
          trend="This week"
          color="primary"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Today's Medications */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-display text-surface-900">Today's Medications</h2>
            <Button variant="outline" size="small">
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Medication
            </Button>
          </div>

          {todayMedications.length === 0 ? (
            <Empty
              title="No medications scheduled"
              message="Add your medications to get started with tracking"
              icon="Pill"
              actionLabel="Add Medication"
            />
          ) : (
            <div className="space-y-4">
              {todayMedications.map((medication) => (
                <MedicationCard
                  key={medication.Id}
                  medication={medication}
                  logs={medicationLogs}
                  onLogTaken={handleLogMedication}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Today's Appointments */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold font-display text-surface-900">Today's Appointments</h3>
              <Button variant="ghost" size="small" className="p-2">
                <ApperIcon name="Plus" size={16} />
              </Button>
            </div>

{todayAppointments.length === 0 ? (
              <div className="text-center py-6">
                <ApperIcon name="Calendar" size={32} className="text-surface-400 mx-auto mb-2" />
                <p className="text-sm text-surface-600">No appointments today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayAppointments.map((appointment) => (
                  <div key={appointment.Id} className="p-3 bg-surface-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-surface-900">{appointment.title_c || appointment.title || appointment.Name}</p>
                        <p className="text-sm text-surface-600">{appointment.time_c || appointment.time}</p>
                      </div>
                      <ApperIcon name="Clock" size={16} className="text-surface-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Upcoming Appointments */}
          {/* Upcoming Appointments */}
          <Card className="p-6">
            <h3 className="text-lg font-bold font-display text-surface-900 mb-4">Upcoming</h3>
            
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-surface-600">No upcoming appointments</p>
              </div>
) : (
              <div className="space-y-3">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.Id} className="p-3 bg-surface-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-surface-900">{appointment.title_c || appointment.title || appointment.Name}</p>
                        <p className="text-sm text-surface-600">
                          {format(new Date(appointment.date_c || appointment.date), "MMM dd")} at {appointment.time_c || appointment.time}
                        </p>
                      </div>
                      <ApperIcon name="ChevronRight" size={16} className="text-surface-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
          {/* Recent Health Metrics */}
          <Card className="p-6">
            <h3 className="text-lg font-bold font-display text-surface-900 mb-4">Recent Metrics</h3>
            
            {recentMetrics.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-surface-600">No recent metrics</p>
              </div>
) : (
              <div className="space-y-3">
                {recentMetrics.map((metric) => (
                  <div key={metric.Id} className="p-3 bg-surface-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-surface-900 capitalize">
                          {(metric.type_c || metric.type)?.replace("_", " ")}
                        </p>
                        <p className="text-sm text-surface-600">
                          {metric.value_c || metric.value} {metric.unit_c || metric.unit}
                        </p>
                      </div>
                      <span className="text-xs text-surface-500">
                        {format(new Date(metric.date_c || metric.date), "MMM dd")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;