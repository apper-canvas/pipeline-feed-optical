import React, { useState } from "react";
import { Card } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const CompanyTable = ({ companies, onCompanySelect, onCompanyEdit, onCompanyDelete }) => {
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedCompanies = [...companies].sort((a, b) => {
    const aValue = a[sortField] || "";
    const bValue = b[sortField] || "";
    
    if (sortDirection === "asc") {
      return aValue.toString().localeCompare(bValue.toString());
    } else {
      return bValue.toString().localeCompare(aValue.toString());
    }
  });

  const getSizeVariant = (size) => {
    switch (size) {
      case "Enterprise":
        return "default";
      case "Large":
        return "secondary";
      case "Medium":
        return "outline";
      case "Small":
        return "destructive";
      case "Startup":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return "ArrowUpDown";
    return sortDirection === "asc" ? "ArrowUp" : "ArrowDown";
  };

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left p-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleSort("name")}
                  className="font-semibold text-slate-900 hover:text-emerald-600"
                >
                  Company Name
                  <ApperIcon name={getSortIcon("name")} className="ml-2 h-4 w-4" />
                </Button>
              </th>
              <th className="text-left p-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleSort("industry")}
                  className="font-semibold text-slate-900 hover:text-emerald-600"
                >
                  Industry
                  <ApperIcon name={getSortIcon("industry")} className="ml-2 h-4 w-4" />
                </Button>
              </th>
              <th className="text-left p-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleSort("location")}
                  className="font-semibold text-slate-900 hover:text-emerald-600"
                >
                  Location
                  <ApperIcon name={getSortIcon("location")} className="ml-2 h-4 w-4" />
                </Button>
              </th>
              <th className="text-left p-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleSort("size")}
                  className="font-semibold text-slate-900 hover:text-emerald-600"
                >
                  Size
                  <ApperIcon name={getSortIcon("size")} className="ml-2 h-4 w-4" />
                </Button>
              </th>
              <th className="text-left p-4">
                <span className="font-semibold text-slate-900">Revenue</span>
              </th>
              <th className="text-left p-4">
                <span className="font-semibold text-slate-900">Website</span>
              </th>
              <th className="text-right p-4">
                <span className="font-semibold text-slate-900">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sortedCompanies.map((company) => (
              <tr 
                key={company.Id}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => onCompanySelect(company)}
              >
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-emerald rounded-lg flex items-center justify-center">
                        <ApperIcon name="Building2" className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {company.name}
                      </p>
                      <p className="text-sm text-slate-500 truncate">
                        {company.employees} employees
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-slate-900">{company.industry}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center text-sm text-slate-900">
                    <ApperIcon name="MapPin" className="h-4 w-4 mr-1 text-slate-400" />
                    {company.location}
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant={getSizeVariant(company.size)}>
                    {company.size}
                  </Badge>
                </td>
                <td className="p-4">
                  <span className="text-sm text-slate-900">
                    {company.revenue ? `$${company.revenue}` : "N/A"}
                  </span>
                </td>
                <td className="p-4">
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm text-emerald-600 hover:text-emerald-800 flex items-center"
                  >
                    <ApperIcon name="ExternalLink" className="h-4 w-4 mr-1" />
                    Visit
                  </a>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCompanyEdit(company);
                      }}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <ApperIcon name="Edit" className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCompanyDelete(company.Id);
                      }}
                      className="text-slate-400 hover:text-red-600"
                    >
                      <ApperIcon name="Trash2" className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default CompanyTable;