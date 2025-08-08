import medicationsData from "@/services/mockData/medications.json";

class MedicationService {
  constructor() {
    this.medications = [...medicationsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.medications];
  }

  async getById(id) {
    await this.delay(200);
    const medication = this.medications.find(med => med.Id === parseInt(id));
    if (!medication) {
      throw new Error("Medication not found");
    }
    return { ...medication };
  }

  async create(medicationData) {
    await this.delay(400);
    const newMedication = {
      ...medicationData,
      Id: this.getNextId()
    };
    this.medications.push(newMedication);
    return { ...newMedication };
  }

  async update(id, medicationData) {
    await this.delay(350);
    const index = this.medications.findIndex(med => med.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Medication not found");
    }
    this.medications[index] = { ...medicationData, Id: parseInt(id) };
    return { ...this.medications[index] };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.medications.findIndex(med => med.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Medication not found");
    }
    const deleted = this.medications.splice(index, 1)[0];
    return { ...deleted };
  }

  getNextId() {
    return Math.max(...this.medications.map(med => med.Id), 0) + 1;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new MedicationService();