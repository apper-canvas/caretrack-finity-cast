import healthMetricsData from "@/services/mockData/healthMetrics.json";

class HealthMetricService {
  constructor() {
    this.healthMetrics = [...healthMetricsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.healthMetrics];
  }

  async getById(id) {
    await this.delay(200);
    const metric = this.healthMetrics.find(metric => metric.Id === parseInt(id));
    if (!metric) {
      throw new Error("Health metric not found");
    }
    return { ...metric };
  }

  async create(metricData) {
    await this.delay(400);
    const newMetric = {
      ...metricData,
      Id: this.getNextId()
    };
    this.healthMetrics.push(newMetric);
    return { ...newMetric };
  }

  async update(id, metricData) {
    await this.delay(350);
    const index = this.healthMetrics.findIndex(metric => metric.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Health metric not found");
    }
    this.healthMetrics[index] = { ...metricData, Id: parseInt(id) };
    return { ...this.healthMetrics[index] };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.healthMetrics.findIndex(metric => metric.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Health metric not found");
    }
    const deleted = this.healthMetrics.splice(index, 1)[0];
    return { ...deleted };
  }

  getNextId() {
    return Math.max(...this.healthMetrics.map(metric => metric.Id), 0) + 1;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new HealthMetricService();