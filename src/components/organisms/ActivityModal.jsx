import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";

const ActivityModal = ({ 
  activity, 
  contacts, 
  deals, 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    type: "",
    contactId: "",
    dealId: "",
    subject: "",
    notes: "",
    date: "",
    outcome: ""
  });

  useEffect(() => {
    if (activity) {
      setFormData({
        type: activity.type || "",
        contactId: activity.contactId || "",
        dealId: activity.dealId || "",
        subject: activity.subject || "",
        notes: activity.notes || "",
        date: activity.date ? new Date(activity.date).toISOString().slice(0, 16) : "",
        outcome: activity.outcome || ""
      });
    } else {
      const now = new Date();
      setFormData({
        type: "",
        contactId: "",
        dealId: "",
        subject: "",
        notes: "",
        date: now.toISOString().slice(0, 16),
        outcome: ""
      });
    }
  }, [activity]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          <Card>
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 gradient-slate">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center">
                    <ApperIcon name="Calendar" className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    {activity ? "Edit Activity" : "New Activity"}
                  </h2>
                </div>
                
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <ApperIcon name="X" className="h-5 w-5 text-white" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Activity Type"
                  type="select"
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                >
                  <option value="">Select type</option>
                  <option value="Call">Call</option>
                  <option value="Email">Email</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Note">Note</option>
                  <option value="Task">Task</option>
                </FormField>
                
                <FormField
                  label="Date & Time"
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                />
                
                <FormField
                  label="Contact"
                  type="select"
                  value={formData.contactId}
                  onChange={(e) => handleInputChange("contactId", e.target.value)}
                >
                  <option value="">Select contact</option>
                  {contacts.map((contact) => (
                    <option key={contact.Id} value={contact.Id}>
                      {contact.name} - {contact.company}
                    </option>
                  ))}
                </FormField>
                
                <FormField
                  label="Deal (Optional)"
                  type="select"
                  value={formData.dealId}
                  onChange={(e) => handleInputChange("dealId", e.target.value)}
                >
                  <option value="">Select deal (optional)</option>
                  {deals.map((deal) => (
                    <option key={deal.Id} value={deal.Id}>
                      {deal.title}
                    </option>
                  ))}
                </FormField>
                
                <div className="md:col-span-2">
                  <FormField
                    label="Subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    placeholder="Enter activity subject"
                  />
                </div>
                
                <FormField
                  label="Outcome"
                  type="select"
                  value={formData.outcome}
                  onChange={(e) => handleInputChange("outcome", e.target.value)}
                >
                  <option value="">Select outcome</option>
                  <option value="Completed">Completed</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="In Progress">In Progress</option>
                </FormField>
                
                <div className="md:col-span-2">
                  <FormField
                    label="Notes"
                    type="textarea"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Enter notes about this activity"
                    rows="4"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                  {activity ? "Update Activity" : "Create Activity"}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ActivityModal;