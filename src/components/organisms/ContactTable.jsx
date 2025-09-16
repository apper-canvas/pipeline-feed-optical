import React, { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const ContactTable = ({ contacts, onContactSelect, onContactEdit, onContactDelete }) => {
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

  const sortedContacts = [...contacts].sort((a, b) => {
    const aValue = a[sortField] || "";
    const bValue = b[sortField] || "";
    
    if (sortDirection === "asc") {
      return aValue.toString().localeCompare(bValue.toString());
    } else {
      return bValue.toString().localeCompare(aValue.toString());
    }
  });

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ApperIcon name="ArrowUpDown" className="h-4 w-4 text-slate-400" />;
    return sortDirection === "asc" 
      ? <ApperIcon name="ArrowUp" className="h-4 w-4 text-emerald-500" />
      : <ApperIcon name="ArrowDown" className="h-4 w-4 text-emerald-500" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Contacts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center space-x-1 font-medium text-slate-700 hover:text-emerald-600 transition-colors"
                  >
                    <span>Name</span>
                    <SortIcon field="name" />
                  </button>
                </th>
                <th className="text-left py-3 px-4">
                  <button
                    onClick={() => handleSort("company")}
                    className="flex items-center space-x-1 font-medium text-slate-700 hover:text-emerald-600 transition-colors"
                  >
                    <span>Company</span>
                    <SortIcon field="company" />
                  </button>
                </th>
                <th className="text-left py-3 px-4">
                  <button
                    onClick={() => handleSort("email")}
                    className="flex items-center space-x-1 font-medium text-slate-700 hover:text-emerald-600 transition-colors"
                  >
                    <span>Email</span>
                    <SortIcon field="email" />
                  </button>
                </th>
                <th className="text-left py-3 px-4">Source</th>
                <th className="text-left py-3 px-4">Tags</th>
                <th className="text-left py-3 px-4">Created</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedContacts.map((contact) => (
                <tr 
                  key={contact.Id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => onContactSelect(contact)}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-medium">
                        {contact.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{contact.name}</div>
                        <div className="text-sm text-slate-500">{contact.position}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-slate-900">{contact.company}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-slate-600">{contact.email}</div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="default">{contact.source}</Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="info" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {contact.tags.length > 2 && (
                        <Badge variant="default" className="text-xs">
                          +{contact.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-600 text-sm">
                    {format(new Date(contact.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onContactEdit(contact);
                        }}
                      >
                        <ApperIcon name="Edit2" className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onContactDelete(contact.Id);
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
      </CardContent>
    </Card>
  );
};

export default ContactTable;