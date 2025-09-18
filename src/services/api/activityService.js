import { toast } from 'react-toastify';

class ActivityService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'activity_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "outcome_c"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to fetch activities:", response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities:", error?.response?.data?.message || error);
      toast.error("Failed to load activities");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "outcome_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(`Failed to fetch activity ${id}:`, response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching activity ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(activityData) {
    try {
      const params = {
        records: [{
          Name: activityData.subject_c || activityData.subject || "",
          type_c: activityData.type_c || activityData.type || "",
          contact_id_c: parseInt(activityData.contact_id_c || activityData.contactId || 0),
          deal_id_c: activityData.deal_id_c || activityData.dealId ? parseInt(activityData.deal_id_c || activityData.dealId) : null,
          subject_c: activityData.subject_c || activityData.subject || "",
          notes_c: activityData.notes_c || activityData.notes || "",
          date_c: activityData.date_c || activityData.date || new Date().toISOString(),
          outcome_c: activityData.outcome_c || activityData.outcome || ""
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to create activity:", response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} activities:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating activity:", error?.response?.data?.message || error);
      toast.error("Failed to create activity");
      return null;
    }
  }

  async update(id, activityData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: activityData.subject_c || activityData.subject || "",
          type_c: activityData.type_c || activityData.type || "",
          contact_id_c: parseInt(activityData.contact_id_c || activityData.contactId || 0),
          deal_id_c: activityData.deal_id_c || activityData.dealId ? parseInt(activityData.deal_id_c || activityData.dealId) : null,
          subject_c: activityData.subject_c || activityData.subject || "",
          notes_c: activityData.notes_c || activityData.notes || "",
          date_c: activityData.date_c || activityData.date || new Date().toISOString(),
          outcome_c: activityData.outcome_c || activityData.outcome || ""
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to update activity:", response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} activities:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating activity:", error?.response?.data?.message || error);
      toast.error("Failed to update activity");
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
        console.error("Failed to delete activity:", response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} activities:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting activity:", error?.response?.data?.message || error);
      toast.error("Failed to delete activity");
      return false;
    }
  }

  async getByContactId(contactId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "outcome_c"}}
        ],
        where: [
          {"FieldName": "contact_id_c", "Operator": "EqualTo", "Values": [parseInt(contactId)], "Include": true}
        ],
        pagingInfo: {"limit": 50, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to fetch activities by contact:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities by contact:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByDealId(dealId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "outcome_c"}}
        ],
        where: [
          {"FieldName": "deal_id_c", "Operator": "EqualTo", "Values": [parseInt(dealId)], "Include": true}
        ],
        pagingInfo: {"limit": 50, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to fetch activities by deal:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities by deal:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export default new ActivityService();