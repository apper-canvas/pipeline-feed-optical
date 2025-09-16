import companiesData from "@/services/mockData/companies.json";

class CompanyService {
  constructor() {
    this.companies = [...companiesData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.companies];
  }

  async getById(id) {
    await this.delay();
    return this.companies.find(company => company.Id === parseInt(id));
  }

  async create(companyData) {
    await this.delay();
    const newCompany = {
      ...companyData,
      Id: Math.max(...this.companies.map(c => c.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.companies.push(newCompany);
    return { ...newCompany };
  }

  async update(id, companyData) {
    await this.delay();
    const index = this.companies.findIndex(company => company.Id === parseInt(id));
    if (index !== -1) {
      this.companies[index] = {
        ...this.companies[index],
        ...companyData,
        Id: parseInt(id),
        updatedAt: new Date().toISOString()
      };
      return { ...this.companies[index] };
    }
    throw new Error("Company not found");
  }

  async delete(id) {
    await this.delay();
    const index = this.companies.findIndex(company => company.Id === parseInt(id));
    if (index !== -1) {
      const deleted = this.companies.splice(index, 1)[0];
      return { ...deleted };
    }
    throw new Error("Company not found");
  }

  async search(query) {
    await this.delay();
    const lowercaseQuery = query.toLowerCase();
    return this.companies.filter(company =>
      company.name.toLowerCase().includes(lowercaseQuery) ||
      company.industry.toLowerCase().includes(lowercaseQuery) ||
      company.location.toLowerCase().includes(lowercaseQuery) ||
      company.website.toLowerCase().includes(lowercaseQuery)
    );
  }
}

export default new CompanyService();