import appointmentsData from "@/services/mockData/appointments.json";

class AppointmentService {
  constructor() {
    this.appointments = [...appointmentsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.appointments];
  }

  async getById(id) {
    await this.delay(200);
    const appointment = this.appointments.find(app => app.Id === parseInt(id));
    if (!appointment) {
      throw new Error("Appointment not found");
    }
    return { ...appointment };
  }

  async create(appointmentData) {
    await this.delay(400);
    const newAppointment = {
      ...appointmentData,
      Id: this.getNextId()
    };
    this.appointments.push(newAppointment);
    return { ...newAppointment };
  }

  async update(id, appointmentData) {
    await this.delay(350);
    const index = this.appointments.findIndex(app => app.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Appointment not found");
    }
    this.appointments[index] = { ...appointmentData, Id: parseInt(id) };
    return { ...this.appointments[index] };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.appointments.findIndex(app => app.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Appointment not found");
    }
    const deleted = this.appointments.splice(index, 1)[0];
    return { ...deleted };
  }

  getNextId() {
    return Math.max(...this.appointments.map(app => app.Id), 0) + 1;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new AppointmentService();