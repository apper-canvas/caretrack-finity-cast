import medicationLogsData from "@/services/mockData/medicationLogs.json";

class MedicationLogService {
  constructor() {
    this.medicationLogs = [...medicationLogsData];
  }

  async getAll() {
    await this.delay(200);
    return [...this.medicationLogs];
  }

  async getById(id) {
    await this.delay(150);
    const log = this.medicationLogs.find(log => log.Id === parseInt(id));
    if (!log) {
      throw new Error("Medication log not found");
    }
    return { ...log };
  }

  async getByMedicationId(medicationId) {
    await this.delay(200);
    return this.medicationLogs.filter(log => log.medicationId === medicationId.toString());
  }

  async create(logData) {
    await this.delay(300);
    const newLog = {
      ...logData,
      Id: this.getNextId()
    };
    this.medicationLogs.push(newLog);
    return { ...newLog };
  }

  async update(id, logData) {
    await this.delay(250);
    const index = this.medicationLogs.findIndex(log => log.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Medication log not found");
    }
    this.medicationLogs[index] = { ...logData, Id: parseInt(id) };
    return { ...this.medicationLogs[index] };
  }

  async delete(id) {
    await this.delay(200);
    const index = this.medicationLogs.findIndex(log => log.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Medication log not found");
    }
    const deleted = this.medicationLogs.splice(index, 1)[0];
    return { ...deleted };
  }

  getNextId() {
    return Math.max(...this.medicationLogs.map(log => log.Id), 0) + 1;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new MedicationLogService();