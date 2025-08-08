import { toast } from 'react-toastify';

class MedicationService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'medication_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "dosage_c" } },
          { field: { Name: "frequency_c" } },
          { field: { Name: "times_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "end_date_c" } },
          { field: { Name: "refill_date_c" } },
          { field: { Name: "notes_c" } }
        ],
        orderBy: [
          { fieldName: "Name", sorttype: "ASC" }
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
        console.error("Error fetching medications:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching medications:", error.message);
        toast.error("Failed to fetch medications");
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
          { field: { Name: "dosage_c" } },
          { field: { Name: "frequency_c" } },
          { field: { Name: "times_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "end_date_c" } },
          { field: { Name: "refill_date_c" } },
          { field: { Name: "notes_c" } }
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
        console.error(`Error fetching medication with ID ${id}:`, error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(`Error fetching medication with ID ${id}:`, error.message);
        toast.error("Failed to fetch medication");
      }
      return null;
    }
  }

  async create(medicationData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: medicationData.Name || medicationData.name || "",
          Tags: medicationData.Tags || "",
          dosage_c: medicationData.dosage_c || medicationData.dosage || "",
          frequency_c: medicationData.frequency_c || medicationData.frequency || "",
          times_c: Array.isArray(medicationData.times_c) ? medicationData.times_c.join(',') : 
                   (Array.isArray(medicationData.times) ? medicationData.times.join(',') : medicationData.times_c || medicationData.times || ""),
          start_date_c: medicationData.start_date_c || medicationData.startDate || "",
          end_date_c: medicationData.end_date_c || medicationData.endDate || "",
          refill_date_c: medicationData.refill_date_c || medicationData.refillDate || "",
          notes_c: medicationData.notes_c || medicationData.notes || ""
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
          console.error(`Failed to create medication ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating medication:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error creating medication:", error.message);
        toast.error("Failed to create medication");
      }
      return null;
    }
  }

  async update(id, medicationData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: medicationData.Name || medicationData.name || "",
          Tags: medicationData.Tags || "",
          dosage_c: medicationData.dosage_c || medicationData.dosage || "",
          frequency_c: medicationData.frequency_c || medicationData.frequency || "",
          times_c: Array.isArray(medicationData.times_c) ? medicationData.times_c.join(',') : 
                   (Array.isArray(medicationData.times) ? medicationData.times.join(',') : medicationData.times_c || medicationData.times || ""),
          start_date_c: medicationData.start_date_c || medicationData.startDate || "",
          end_date_c: medicationData.end_date_c || medicationData.endDate || "",
          refill_date_c: medicationData.refill_date_c || medicationData.refillDate || "",
          notes_c: medicationData.notes_c || medicationData.notes || ""
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
          console.error(`Failed to update medication ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating medication:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error updating medication:", error.message);
        toast.error("Failed to update medication");
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
          console.error(`Failed to delete medication ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting medication:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error deleting medication:", error.message);
        toast.error("Failed to delete medication");
      }
      return false;
    }
  }
}
export default new MedicationService();