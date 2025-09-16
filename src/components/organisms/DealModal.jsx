import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";

const DealModal = ({ 
  deal, 
  contacts, 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    title: "",
    contactId: "",
    value: "",
    stage: "Lead",
    probability: "",
    expectedCloseDate: "",
    description: ""
  });

  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title || "",
        contactId: deal.contactId || "",
        value: deal.value?.toString() || "",
        stage: deal.stage || "Lead",
        probability: deal.probability?.toString() || "",
        expectedCloseDate: deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toISOString().split('T')[0] : "",
        description: deal.description || ""
      });
    } else {
      setFormData({
        title: "",
        contactId: "",
        value: "",
        stage: "Lead",
        probability: "",
        expectedCloseDate: "",
        description: ""
      });
    }
  }, [deal]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const dealData = {
      ...formData,
      value: parseFloat(formData.value) || 0,
      probability: parseInt(formData.probability) || 0
    };
    onSave(dealData);
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
                    <ApperIcon name="Target" className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    {deal ? "Edit Deal" : "New Deal"}
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
                <div className="md:col-span-2">
                  <FormField
                    label="Deal Title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter deal title"
                  />
                </div>
                
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
                  label="Deal Value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => handleInputChange("value", e.target.value)}
                  placeholder="Enter deal value"
                />
                
                <FormField
                  label="Stage"
                  type="select"
                  value={formData.stage}
                  onChange={(e) => handleInputChange("stage", e.target.value)}
                >
                  <option value="Lead">Lead</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal">Proposal</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Closed Won">Closed Won</option>
                  <option value="Closed Lost">Closed Lost</option>
                </FormField>
                
                <FormField
                  label="Probability (%)"
                  type="number"
                  value={formData.probability}
                  onChange={(e) => handleInputChange("probability", e.target.value)}
                  placeholder="Enter probability (0-100)"
                  min="0"
                  max="100"
                />
                
                <FormField
                  label="Expected Close Date"
                  type="date"
                  value={formData.expectedCloseDate}
                  onChange={(e) => handleInputChange("expectedCloseDate", e.target.value)}
                />
                
                <div className="md:col-span-2">
                  <FormField
                    label="Description"
                    type="textarea"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Enter deal description"
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
                  {deal ? "Update Deal" : "Create Deal"}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DealModal;