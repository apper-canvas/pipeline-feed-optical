import { toast } from 'react-toastify';

class CompanyService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'company_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "employees_c"}},
          {"field": {"Name": "revenue_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "monthly_sales_c"}},
          {"field": {"Name": "rating_c"}},
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
        console.error("Failed to fetch companies:", response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching companies:", error?.response?.data?.message || error);
      toast.error("Failed to load companies");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "employees_c"}},
          {"field": {"Name": "revenue_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "monthly_sales_c"}},
          {"field": {"Name": "rating_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(`Failed to fetch company ${id}:`, response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching company ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(companyData) {
    try {
      const params = {
        records: [{
          Name: companyData.name_c || companyData.name || "",
          name_c: companyData.name_c || companyData.name || "",
          industry_c: companyData.industry_c || companyData.industry || "",
          location_c: companyData.location_c || companyData.location || "",
          size_c: companyData.size_c || companyData.size || "",
          employees_c: companyData.employees_c || companyData.employees || null,
          revenue_c: companyData.revenue_c || companyData.revenue || "",
          website_c: companyData.website_c || companyData.website || "",
          phone_c: companyData.phone_c || companyData.phone || "",
          email_c: companyData.email_c || companyData.email || "",
          description_c: companyData.description_c || companyData.description || "",
          monthly_sales_c: companyData.monthly_sales_c || companyData.monthlySales || null,
          rating_c: companyData.rating_c || companyData.rating || null,
          created_at_c: new Date().toISOString(),
          updated_at_c: new Date().toISOString()
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to create company:", response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} companies:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating company:", error?.response?.data?.message || error);
      toast.error("Failed to create company");
      return null;
    }
  }

  async update(id, companyData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: companyData.name_c || companyData.name || "",
          name_c: companyData.name_c || companyData.name || "",
          industry_c: companyData.industry_c || companyData.industry || "",
          location_c: companyData.location_c || companyData.location || "",
          size_c: companyData.size_c || companyData.size || "",
          employees_c: companyData.employees_c || companyData.employees || null,
          revenue_c: companyData.revenue_c || companyData.revenue || "",
          website_c: companyData.website_c || companyData.website || "",
          phone_c: companyData.phone_c || companyData.phone || "",
          email_c: companyData.email_c || companyData.email || "",
          description_c: companyData.description_c || companyData.description || "",
          monthly_sales_c: companyData.monthly_sales_c || companyData.monthlySales || null,
          rating_c: companyData.rating_c || companyData.rating || null,
          updated_at_c: new Date().toISOString()
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to update company:", response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} companies:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating company:", error?.response?.data?.message || error);
      toast.error("Failed to update company");
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
        console.error("Failed to delete company:", response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} companies:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting company:", error?.response?.data?.message || error);
      toast.error("Failed to delete company");
      return false;
    }
  }

  async search(query) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "website_c"}}
        ],
        where: [
          {"FieldName": "name_c", "Operator": "Contains", "Values": [query], "Include": true}
        ],
        pagingInfo: {"limit": 50, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to search companies:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error searching companies:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export default new CompanyService();