import dealsData from "@/services/mockData/deals.json";

class DealService {
  constructor() {
    this.deals = [...dealsData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.deals];
  }

  async getById(id) {
    await this.delay();
    return this.deals.find(deal => deal.Id === parseInt(id));
  }

  async create(dealData) {
    await this.delay();
    const newDeal = {
      ...dealData,
      Id: Math.max(...this.deals.map(d => d.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.deals.push(newDeal);
    return { ...newDeal };
  }

  async update(id, dealData) {
    await this.delay();
    const index = this.deals.findIndex(deal => deal.Id === parseInt(id));
    if (index !== -1) {
      this.deals[index] = {
        ...this.deals[index],
        ...dealData,
        Id: parseInt(id),
        updatedAt: new Date().toISOString()
      };
      return { ...this.deals[index] };
    }
    throw new Error("Deal not found");
  }

  async delete(id) {
    await this.delay();
    const index = this.deals.findIndex(deal => deal.Id === parseInt(id));
    if (index !== -1) {
      const deleted = this.deals.splice(index, 1)[0];
      return { ...deleted };
    }
    throw new Error("Deal not found");
  }

  async updateStage(id, stage) {
    await this.delay();
    const index = this.deals.findIndex(deal => deal.Id === parseInt(id));
    if (index !== -1) {
      this.deals[index] = {
        ...this.deals[index],
        stage,
        updatedAt: new Date().toISOString()
      };
      return { ...this.deals[index] };
    }
    throw new Error("Deal not found");
  }

  async getByContactId(contactId) {
    await this.delay();
    return this.deals.filter(deal => deal.contactId === parseInt(contactId));
  }
}

export default new DealService();