import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";

const ActivityLog = ({ activities, contacts, deals }) => {
  const getContactName = (contactId) => {
    if (!contactId) return "Unknown Contact";
    const contact = contacts.find(c => c.Id === contactId);
    return contact ? contact.name : "Unknown Contact";
  };

  const getDealTitle = (dealId) => {
    if (!dealId) return null;
    const deal = deals.find(d => d.Id === dealId);
    return deal ? deal.title : null;
  };

const getActivityIcon = (type) => {
    const icons = {
      call: "Phone",
      email: "Mail",
      meeting: "Calendar",
      note: "FileText",
      task: "CheckSquare"
    };
    return icons[type?.toLowerCase()] || "Activity";
  };

  const sortedActivities = [...activities].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedActivities.map((activity) => {
            const dealTitle = getDealTitle(activity.dealId);
            
            return (
              <div
                key={activity.Id}
                className="flex items-start space-x-4 p-4 border border-slate-200 rounded-lg hover:border-emerald-300 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center">
                    <ApperIcon 
                      name={getActivityIcon(activity.type)} 
                      className="h-5 w-5 text-white" 
                    />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-slate-900">{activity.subject}</h4>
                      <Badge variant="info" className="text-xs">
                        {activity.type}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StatusBadge status={activity.outcome} type="activity" />
                      <span className="text-xs text-slate-500">
                        {format(new Date(activity.date), "MMM d, h:mm a")}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-slate-600 mb-2">
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="User" className="h-4 w-4" />
                      <span>{getContactName(activity.contactId)}</span>
                    </div>
                    {dealTitle && (
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Target" className="h-4 w-4" />
                        <span>{dealTitle}</span>
                      </div>
                    )}
                  </div>
                  
                  {activity.notes && (
                    <p className="text-slate-600 text-sm">{activity.notes}</p>
                  )}
                </div>
              </div>
            );
          })}
          
          {sortedActivities.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <ApperIcon name="Calendar" className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No activities recorded yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityLog;