import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import MedicationCard from "@/components/molecules/MedicationCard";
import MedicationModal from "@/components/organisms/MedicationModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import medicationService from "@/services/api/medicationService";
import medicationLogService from "@/services/api/medicationLogService";

const Medications = () => {
  const [medications, setMedications] = useState([]);
  const [medicationLogs, setMedicationLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);
  const [filterType, setFilterType] = useState("all");

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [medsData, logsData] = await Promise.all([
        medicationService.getAll(),
        medicationLogService.getAll()
      ]);
      
      setMedications(medsData);
      setMedicationLogs(logsData);
    } catch (err) {
      setError("Failed to load medications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      if (editingMedication) {
        await medicationService.update(editingMedication.Id, formData);
        toast.success("Medication updated successfully!");
      } else {
        await medicationService.create(formData);
        toast.success("Medication added successfully!");
      }
      
      setShowModal(false);
      setEditingMedication(null);
      loadData();
    } catch (error) {
      toast.error("Failed to save medication. Please try again.");
    }
  };

  const handleEdit = (medication) => {
    setEditingMedication(medication);
    setShowModal(true);
  };

  const handleDelete = async (medicationId) => {
    if (!window.confirm("Are you sure you want to delete this medication?")) {
      return;
    }

    try {
      await medicationService.delete(medicationId);
      toast.success("Medication deleted successfully!");
      loadData();
    } catch (error) {
      toast.error("Failed to delete medication. Please try again.");
    }
  };

  const handleLogMedication = async (medicationId, scheduledTime) => {
    try {
      const newLog = {
        medicationId: medicationId.toString(),
        scheduledTime,
        takenTime: new Date().toTimeString().slice(0, 5),
        status: "taken",
        date: new Date().toISOString().split("T")[0]
      };

      await medicationLogService.create(newLog);
      const updatedLogs = await medicationLogService.getAll();
      setMedicationLogs(updatedLogs);
      
      toast.success("Medication logged successfully!");
    } catch (error) {
      toast.error("Failed to log medication. Please try again.");
    }
  };

  const filteredMedications = medications.filter(medication => {
    if (filterType === "all") return true;
    if (filterType === "active") return !medication.endDate || new Date(medication.endDate) >= new Date();
    if (filterType === "refill_needed") {
      return medication.refillDate && new Date(medication.refillDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
    return true;
  });

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-surface-900">Medications</h1>
          <p className="text-surface-600 mt-1">Manage your medications and track adherence</p>
        </div>
        
        <Button 
          onClick={() => {
            setEditingMedication(null);
            setShowModal(true);
          }}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={20} />
          <span>Add Medication</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filterType === "all" ? "primary" : "outline"}
          size="small"
          onClick={() => setFilterType("all")}
        >
          All Medications ({medications.length})
        </Button>
        <Button
          variant={filterType === "active" ? "primary" : "outline"}
          size="small"
          onClick={() => setFilterType("active")}
        >
          <ApperIcon name="Activity" size={16} className="mr-2" />
          Active
        </Button>
        <Button
          variant={filterType === "refill_needed" ? "primary" : "outline"}
          size="small"
          onClick={() => setFilterType("refill_needed")}
        >
          <ApperIcon name="AlertTriangle" size={16} className="mr-2" />
          Refill Needed
        </Button>
      </div>

      {/* Medications List */}
      {filteredMedications.length === 0 ? (
        <Empty
          title="No medications found"
          message="Start by adding your first medication to keep track of your health regimen"
          icon="Pill"
          actionLabel="Add Medication"
          onAction={() => {
            setEditingMedication(null);
            setShowModal(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMedications.map((medication) => (
            <MedicationCard
              key={medication.Id}
              medication={medication}
              logs={medicationLogs}
              onLogTaken={handleLogMedication}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Medication Modal */}
      <MedicationModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingMedication(null);
        }}
        onSubmit={handleSubmit}
        medication={editingMedication}
      />
    </div>
  );
};

export default Medications;