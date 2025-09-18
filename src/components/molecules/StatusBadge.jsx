import React from "react";
import Badge from "@/components/atoms/Badge";

const StatusBadge = ({ status = "", type = "deal" }) => {
  const getVariant = (status, type) => {
    if (type === "deal") {
      switch (status.toLowerCase()) {
        case "lead": return "info";
        case "qualified": return "warning";
        case "proposal": return "default";
        case "negotiation": return "warning";
        case "closed won": return "success";
        case "closed lost": return "danger";
        default: return "default";
      }
    }
    
    if (type === "activity") {
      switch (status.toLowerCase()) {
        case "completed": return "success";
        case "scheduled": return "info";
        case "cancelled": return "danger";
        case "in progress": return "warning";
        default: return "default";
      }
    }
    
    return "default";
  };

  return (
    <Badge variant={getVariant(status, type)}>
      {status}
    </Badge>
  );
};

export default StatusBadge;