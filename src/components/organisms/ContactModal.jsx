import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";

const ContactModal = ({ 
  contact, 
  deals, 
  activities, 
  isOpen, 
  onClose, 
  onSave, 
  isEditing = false 
}) => {
  const [activeTab, setActiveTab] = useState("info");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    source: "",
    tags: []
  });

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || "",
        email: contact.email || "",
        phone: contact.phone || "",
        company: contact.company || "",
        position: contact.position || "",
        source: contact.source || "",
        tags: contact.tags || []
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        position: "",
        source: "",
        tags: []
      });
    }
  }, [contact]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagsChange = (value) => {
    const tags = value.split(",").map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const contactDeals = deals.filter(deal => deal.contactId === contact?.Id);
  const contactActivities = activities.filter(activity => activity.contactId === contact?.Id);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const tabs = [
    { id: "info", label: "Contact Info", icon: "User" },
    { id: "deals", label: "Deals", icon: "Target", count: contactDeals.length },
    { id: "activities", label: "Activities", icon: "Calendar", count: contactActivities.length }
  ];

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
          className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 gradient-slate">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                    {contact?.name ? contact.name.charAt(0).toUpperCase() : "N"}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {isEditing ? (contact ? "Edit Contact" : "New Contact") : contact?.name}
                    </h2>
                    {!isEditing && contact && (
                      <p className="text-slate-300">{contact.position} at {contact.company}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {!isEditing && (
                    <Button variant="secondary" size="sm" onClick={() => setActiveTab("info")}>
                      <ApperIcon name="Edit2" className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    <ApperIcon name="X" className="h-5 w-5 text-white" />
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              {!isEditing && contact && (
                <div className="flex space-x-1 mt-4">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? "bg-emerald-500 text-white"
                          : "text-slate-300 hover:bg-slate-600 hover:text-white"
                      }`}
                    >
                      <ApperIcon name={tab.icon} className="h-4 w-4" />
                      <span>{tab.label}</span>
                      {tab.count !== undefined && (
                        <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {(isEditing || activeTab === "info") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter full name"
                  />
                  
                  <FormField
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter email address"
                  />
                  
                  <FormField
                    label="Phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter phone number"
                  />
                  
                  <FormField
                    label="Company"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    placeholder="Enter company name"
                  />
                  
                  <FormField
                    label="Position"
                    value={formData.position}
                    onChange={(e) => handleInputChange("position", e.target.value)}
                    placeholder="Enter job title"
                  />
                  
                  <FormField
                    label="Source"
                    type="select"
                    value={formData.source}
                    onChange={(e) => handleInputChange("source", e.target.value)}
                  >
                    <option value="">Select source</option>
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Cold Call">Cold Call</option>
                    <option value="Email Campaign">Email Campaign</option>
                    <option value="Event">Event</option>
                  </FormField>
                  
                  <div className="md:col-span-2">
                    <FormField
                      label="Tags (comma separated)"
                      value={formData.tags.join(", ")}
                      onChange={(e) => handleTagsChange(e.target.value)}
                      placeholder="Enter tags separated by commas"
                    />
                  </div>
                </div>
              )}

              {!isEditing && activeTab === "deals" && (
                <div className="space-y-4">
                  {contactDeals.map((deal) => (
                    <Card key={deal.Id} className="card-hover">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-slate-900">{deal.title}</h4>
                          <StatusBadge status={deal.stage} />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500">Value:</span>
                            <div className="font-semibold text-emerald-600">
                              {formatCurrency(deal.value)}
                            </div>
                          </div>
                          <div>
                            <span className="text-slate-500">Probability:</span>
                            <div className="font-semibold">{deal.probability}%</div>
                          </div>
                          <div>
                            <span className="text-slate-500">Expected Close:</span>
                            <div className="font-semibold">
                              {format(new Date(deal.expectedCloseDate), "MMM d, yyyy")}
                            </div>
                          </div>
                          <div>
                            <span className="text-slate-500">Created:</span>
                            <div className="font-semibold">
                              {format(new Date(deal.createdAt), "MMM d, yyyy")}
                            </div>
                          </div>
                        </div>
                        {deal.description && (
                          <p className="text-slate-600 mt-3 text-sm">{deal.description}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  
                  {contactDeals.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      <ApperIcon name="Target" className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No deals associated with this contact</p>
                    </div>
                  )}
                </div>
              )}

              {!isEditing && activeTab === "activities" && (
                <div className="space-y-4">
                  {contactActivities.map((activity) => (
                    <Card key={activity.Id} className="card-hover">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center">
                            <ApperIcon name="Calendar" className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-slate-900">{activity.subject}</h4>
                              <div className="flex items-center space-x-2">
                                <StatusBadge status={activity.outcome} type="activity" />
                                <span className="text-xs text-slate-500">
                                  {format(new Date(activity.date), "MMM d, h:mm a")}
                                </span>
                              </div>
                            </div>
                            <div className="text-sm text-slate-600 mb-2">
                              Type: {activity.type}
                            </div>
                            {activity.notes && (
                              <p className="text-slate-600 text-sm">{activity.notes}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {contactActivities.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      <ApperIcon name="Calendar" className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No activities recorded for this contact</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {isEditing && (
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                    {contact ? "Update Contact" : "Create Contact"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ContactModal;