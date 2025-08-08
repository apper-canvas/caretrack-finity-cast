import { toast } from 'react-toastify';

class MedicationLogService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'medication_log_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "medication_id_c" } },
          { field: { Name: "scheduled_time_c" } },
          { field: { Name: "taken_time_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "date_c" } }
        ],
        orderBy: [
          { fieldName: "date_c", sorttype: "DESC" }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching medication logs:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching medication logs:", error.message);
        toast.error("Failed to fetch medication logs");
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "medication_id_c" } },
          { field: { Name: "scheduled_time_c" } },
          { field: { Name: "taken_time_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "date_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching medication log with ID ${id}:`, error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(`Error fetching medication log with ID ${id}:`, error.message);
        toast.error("Failed to fetch medication log");
      }
      return null;
    }
  }

  async getByMedicationId(medicationId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "medication_id_c" } },
          { field: { Name: "scheduled_time_c" } },
          { field: { Name: "taken_time_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "date_c" } }
        ],
        where: [
          {
            FieldName: "medication_id_c",
            Operator: "EqualTo",
            Values: [parseInt(medicationId)]
          }
        ],
        orderBy: [
          { fieldName: "date_c", sorttype: "DESC" }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching medication logs by medication ID:", error?.response?.data?.message);
      } else {
        console.error("Error fetching medication logs by medication ID:", error.message);
      }
      return [];
    }
  }

  async create(logData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: logData.Name || logData.name || "",
          Tags: logData.Tags || "",
          medication_id_c: parseInt(logData.medication_id_c || logData.medicationId),
          scheduled_time_c: logData.scheduled_time_c || logData.scheduledTime || "",
          taken_time_c: logData.taken_time_c || logData.takenTime || "",
          status_c: logData.status_c || logData.status || "",
          date_c: logData.date_c || logData.date || ""
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create medication log ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating medication log:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error creating medication log:", error.message);
        toast.error("Failed to create medication log");
      }
      return null;
    }
  }

  async update(id, logData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: logData.Name || logData.name || "",
          Tags: logData.Tags || "",
          medication_id_c: parseInt(logData.medication_id_c || logData.medicationId),
          scheduled_time_c: logData.scheduled_time_c || logData.scheduledTime || "",
          taken_time_c: logData.taken_time_c || logData.takenTime || "",
          status_c: logData.status_c || logData.status || "",
          date_c: logData.date_c || logData.date || ""
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update medication log ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating medication log:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error updating medication log:", error.message);
        toast.error("Failed to update medication log");
      }
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete medication log ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting medication log:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error deleting medication log:", error.message);
        toast.error("Failed to delete medication log");
      }
      return false;
    }
  }
}

export default new MedicationLogService();