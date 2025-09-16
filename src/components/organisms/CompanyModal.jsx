import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import Label from "@/components/atoms/Label";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";

const CompanyModal = ({ company, isOpen, onClose, onSave, isEditing }) => {
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    location: "",
    size: "",
    employees: "",
    revenue: "",
    website: "",
    phone: "",
    email: "",
    description: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const industryOptions = [
    { value: "Technology", label: "Technology" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Finance", label: "Finance" },
    { value: "Manufacturing", label: "Manufacturing" },
    { value: "Retail", label: "Retail" },
    { value: "Education", label: "Education" },
    { value: "Real Estate", label: "Real Estate" },
    { value: "Professional Services", label: "Professional Services" },
    { value: "Media & Entertainment", label: "Media & Entertainment" },
    { value: "Other", label: "Other" }
  ];

  const sizeOptions = [
    { value: "Startup", label: "Startup (1-10)" },
    { value: "Small", label: "Small (11-50)" },
    { value: "Medium", label: "Medium (51-200)" },
    { value: "Large", label: "Large (201-1000)" },
    { value: "Enterprise", label: "Enterprise (1000+)" }
  ];

  useEffect(() => {
    if (company && isOpen) {
      setFormData({
        name: company.name || "",
        industry: company.industry || "",
        location: company.location || "",
        size: company.size || "",
        employees: company.employees?.toString() || "",
        revenue: company.revenue || "",
        website: company.website || "",
        phone: company.phone || "",
        email: company.email || "",
        description: company.description || ""
      });
    } else if (isOpen && !company) {
      setFormData({
        name: "",
        industry: "",
        location: "",
        size: "",
        employees: "",
        revenue: "",
        website: "",
        phone: "",
        email: "",
        description: ""
      });
    }
    setErrors({});
  }, [company, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Company name is required";
    }

    if (!formData.industry) {
      newErrors.industry = "Industry is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.website && !formData.website.startsWith('http')) {
      newErrors.website = "Website must start with http:// or https://";
    }

    if (formData.employees && (isNaN(formData.employees) || parseInt(formData.employees) < 0)) {
      newErrors.employees = "Employees must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        employees: formData.employees ? parseInt(formData.employees) : null
      };
      
      await onSave(submitData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      industry: "",
      location: "",
      size: "",
      employees: "",
      revenue: "",
      website: "",
      phone: "",
      email: "",
      description: ""
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 flex items-center">
            <ApperIcon name="Building2" className="h-5 w-5 mr-2" />
            {isEditing 
              ? (company ? "Edit Company" : "New Company") 
              : "Company Details"
            }
          </h2>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <ApperIcon name="X" className="h-5 w-5" />
          </Button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Company Name"
                error={errors.name}
                required
              >
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter company name"
                  className={errors.name ? "border-red-300" : ""}
                />
              </FormField>

              <FormField
                label="Industry"
                error={errors.industry}
                required
              >
                <Select
                  value={formData.industry}
                  onValueChange={(value) => handleInputChange("industry", value)}
                  className={errors.industry ? "border-red-300" : ""}
                >
                  <option value="">Select industry</option>
                  {industryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField
                label="Location"
                error={errors.location}
                required
              >
                <Input
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="City, State/Country"
                  className={errors.location ? "border-red-300" : ""}
                />
              </FormField>

              <FormField
                label="Company Size"
                error={errors.size}
              >
                <Select
                  value={formData.size}
                  onValueChange={(value) => handleInputChange("size", value)}
                >
                  <option value="">Select size</option>
                  {sizeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField
                label="Number of Employees"
                error={errors.employees}
              >
                <Input
                  type="number"
                  value={formData.employees}
                  onChange={(e) => handleInputChange("employees", e.target.value)}
                  placeholder="Enter number of employees"
                  min="1"
                  className={errors.employees ? "border-red-300" : ""}
                />
              </FormField>

              <FormField
                label="Annual Revenue"
                error={errors.revenue}
              >
                <Input
                  value={formData.revenue}
                  onChange={(e) => handleInputChange("revenue", e.target.value)}
                  placeholder="e.g., $10M, $50M"
                />
              </FormField>

              <FormField
                label="Website"
                error={errors.website}
              >
                <Input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="https://example.com"
                  className={errors.website ? "border-red-300" : ""}
                />
              </FormField>

              <FormField
                label="Phone"
                error={errors.phone}
              >
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </FormField>

              <FormField
                label="Email"
                error={errors.email}
              >
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="contact@company.com"
                  className={errors.email ? "border-red-300" : ""}
                />
              </FormField>
            </div>

            <FormField
              label="Description"
              error={errors.description}
            >
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Brief description of the company..."
                rows={4}
              />
            </FormField>

            <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[100px]"
              >
                {isSubmitting ? (
                  <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />
                ) : (
                  company ? "Update Company" : "Create Company"
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="p-6">
            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-emerald rounded-xl flex items-center justify-center">
                    <ApperIcon name="Building2" className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{company?.name}</h3>
                  <p className="text-slate-600 mb-4">{company?.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <ApperIcon name="Building" className="h-4 w-4 text-slate-400 mr-2" />
                        <span className="font-medium text-slate-900">Industry:</span>
                        <span className="ml-1 text-slate-600">{company?.industry}</span>
                      </div>
                      <div className="flex items-center">
                        <ApperIcon name="MapPin" className="h-4 w-4 text-slate-400 mr-2" />
                        <span className="font-medium text-slate-900">Location:</span>
                        <span className="ml-1 text-slate-600">{company?.location}</span>
                      </div>
                      <div className="flex items-center">
                        <ApperIcon name="Users" className="h-4 w-4 text-slate-400 mr-2" />
                        <span className="font-medium text-slate-900">Size:</span>
                        <span className="ml-1 text-slate-600">{company?.size} ({company?.employees} employees)</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <ApperIcon name="DollarSign" className="h-4 w-4 text-slate-400 mr-2" />
                        <span className="font-medium text-slate-900">Revenue:</span>
                        <span className="ml-1 text-slate-600">{company?.revenue || "N/A"}</span>
                      </div>
                      <div className="flex items-center">
                        <ApperIcon name="Globe" className="h-4 w-4 text-slate-400 mr-2" />
                        <span className="font-medium text-slate-900">Website:</span>
                        <a 
                          href={company?.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="ml-1 text-emerald-600 hover:text-emerald-800"
                        >
                          Visit site
                        </a>
                      </div>
                      <div className="flex items-center">
                        <ApperIcon name="Phone" className="h-4 w-4 text-slate-400 mr-2" />
                        <span className="font-medium text-slate-900">Phone:</span>
                        <span className="ml-1 text-slate-600">{company?.phone || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyModal;