import activitiesData from "@/services/mockData/activities.json";

class ActivityService {
  constructor() {
    this.activities = [...activitiesData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.activities];
  }

  async getById(id) {
    await this.delay();
    return this.activities.find(activity => activity.Id === parseInt(id));
  }

  async create(activityData) {
    await this.delay();
    const newActivity = {
      ...activityData,
      Id: Math.max(...this.activities.map(a => a.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.activities.push(newActivity);
    return { ...newActivity };
  }

  async update(id, activityData) {
    await this.delay();
    const index = this.activities.findIndex(activity => activity.Id === parseInt(id));
    if (index !== -1) {
      this.activities[index] = {
        ...this.activities[index],
        ...activityData,
        Id: parseInt(id),
        updatedAt: new Date().toISOString()
      };
      return { ...this.activities[index] };
    }
    throw new Error("Activity not found");
  }

  async delete(id) {
    await this.delay();
    const index = this.activities.findIndex(activity => activity.Id === parseInt(id));
    if (index !== -1) {
      const deleted = this.activities.splice(index, 1)[0];
      return { ...deleted };
    }
    throw new Error("Activity not found");
  }

  async getByContactId(contactId) {
    await this.delay();
    return this.activities.filter(activity => activity.contactId === parseInt(contactId));
  }

  async getByDealId(dealId) {
    await this.delay();
    return this.activities.filter(activity => activity.dealId === parseInt(dealId));
  }
}

export default new ActivityService();