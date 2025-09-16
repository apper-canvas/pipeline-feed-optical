import contactsData from "@/services/mockData/contacts.json";

class ContactService {
  constructor() {
    this.contacts = [...contactsData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.contacts];
  }

  async getById(id) {
    await this.delay();
    return this.contacts.find(contact => contact.Id === parseInt(id));
  }

  async create(contactData) {
    await this.delay();
    const newContact = {
      ...contactData,
      Id: Math.max(...this.contacts.map(c => c.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.contacts.push(newContact);
    return { ...newContact };
  }

  async update(id, contactData) {
    await this.delay();
    const index = this.contacts.findIndex(contact => contact.Id === parseInt(id));
    if (index !== -1) {
      this.contacts[index] = {
        ...this.contacts[index],
        ...contactData,
        Id: parseInt(id),
        updatedAt: new Date().toISOString()
      };
      return { ...this.contacts[index] };
    }
    throw new Error("Contact not found");
  }

  async delete(id) {
    await this.delay();
    const index = this.contacts.findIndex(contact => contact.Id === parseInt(id));
    if (index !== -1) {
      const deleted = this.contacts.splice(index, 1)[0];
      return { ...deleted };
    }
    throw new Error("Contact not found");
  }

  async search(query) {
    await this.delay();
    const lowercaseQuery = query.toLowerCase();
    return this.contacts.filter(contact =>
      contact.name.toLowerCase().includes(lowercaseQuery) ||
      contact.email.toLowerCase().includes(lowercaseQuery) ||
      contact.company.toLowerCase().includes(lowercaseQuery) ||
      contact.position.toLowerCase().includes(lowercaseQuery)
    );
  }
}

export default new ContactService();