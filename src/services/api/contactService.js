import { toast } from "react-toastify";
import React from "react";

class ContactService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'contact_c';
  }

  async getAll() {
    try {
      const params = {
fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "source_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "hobbies_c"}},
          {"field": {"Name": "personal_rating_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "salary_c"}},
          {"field": {"Name": "company_website_c"}},
          {"field": {"Name": "radio_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to fetch contacts:", response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching contacts:", error?.response?.data?.message || error);
      toast.error("Failed to load contacts");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "source_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "hobbies_c"}},
          {"field": {"Name": "personal_rating_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "salary_c"}},
          {"field": {"Name": "company_website_c"}},
          {"field": {"Name": "radio_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(`Failed to fetch contact ${id}:`, response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

async create(contactData) {
    try {
      const params = {
        records: [{
          Name: contactData.name_c || contactData.name || "",
          name_c: contactData.name_c || contactData.name || "",
          email_c: contactData.email_c || contactData.email || "",
          phone_c: contactData.phone_c || contactData.phone || "",
          company_c: contactData.company_c || contactData.company || "",
          position_c: contactData.position_c || contactData.position || "",
          source_c: contactData.source_c || contactData.source || "",
          tags_c: Array.isArray(contactData.tags_c) ? contactData.tags_c.join(',') : 
                  Array.isArray(contactData.tags) ? contactData.tags.join(',') : 
                  contactData.tags_c || contactData.tags || "",
          hobbies_c: Array.isArray(contactData.hobbies_c) ? contactData.hobbies_c.join(',') : 
                     Array.isArray(contactData.hobbies) ? contactData.hobbies.join(',') : 
                     contactData.hobbies_c || contactData.hobbies || "",
          personal_rating_c: contactData.personal_rating_c || contactData.personalRating || 0,
          gender_c: contactData.gender_c || contactData.gender || "",
          salary_c: parseFloat(contactData.salary_c || contactData.salary || 0),
          company_website_c: contactData.company_website_c || contactData.companyWebsite || "",
          radio_c: contactData.radio_c || contactData.radio || "",
          created_at_c: new Date().toISOString(),
          updated_at_c: new Date().toISOString()
        }]
      };
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to create contact:", response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} contacts:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating contact:", error?.response?.data?.message || error);
      toast.error("Failed to create contact");
      return null;
    }
  }

async update(id, contactData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: contactData.name_c || contactData.name || "",
          name_c: contactData.name_c || contactData.name || "",
          email_c: contactData.email_c || contactData.email || "",
          phone_c: contactData.phone_c || contactData.phone || "",
          company_c: contactData.company_c || contactData.company || "",
          position_c: contactData.position_c || contactData.position || "",
          source_c: contactData.source_c || contactData.source || "",
          tags_c: Array.isArray(contactData.tags_c) ? contactData.tags_c.join(',') : 
                  Array.isArray(contactData.tags) ? contactData.tags.join(',') : 
                  contactData.tags_c || contactData.tags || "",
          hobbies_c: Array.isArray(contactData.hobbies_c) ? contactData.hobbies_c.join(',') : 
                     Array.isArray(contactData.hobbies) ? contactData.hobbies.join(',') : 
                     contactData.hobbies_c || contactData.hobbies || "",
          personal_rating_c: contactData.personal_rating_c || contactData.personalRating || 0,
          gender_c: contactData.gender_c || contactData.gender || "",
          salary_c: parseFloat(contactData.salary_c || contactData.salary || 0),
          company_website_c: contactData.company_website_c || contactData.companyWebsite || "",
          radio_c: contactData.radio_c || contactData.radio || "",
          updated_at_c: new Date().toISOString()
        }]
      };
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to update contact:", response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} contacts:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating contact:", error?.response?.data?.message || error);
      toast.error("Failed to update contact");
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
        console.error("Failed to delete contact:", response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} contacts:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting contact:", error?.response?.data?.message || error);
      toast.error("Failed to delete contact");
      return false;
    }
  }

  async search(query) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "position_c"}}
        ],
        where: [
          {"FieldName": "name_c", "Operator": "Contains", "Values": [query], "Include": true}
        ],
        pagingInfo: {"limit": 50, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to search contacts:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error searching contacts:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export default new ContactService();