import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const PipelineBoard = ({ deals, contacts, onDealEdit, onDealDelete, onDealStageChange }) => {
  const [draggedDeal, setDraggedDeal] = useState(null);

  const stages = [
    { id: "Lead", title: "Lead", color: "bg-blue-100 border-blue-200" },
    { id: "Qualified", title: "Qualified", color: "bg-yellow-100 border-yellow-200" },
    { id: "Proposal", title: "Proposal", color: "bg-orange-100 border-orange-200" },
    { id: "Negotiation", title: "Negotiation", color: "bg-purple-100 border-purple-200" },
    { id: "Closed Won", title: "Closed Won", color: "bg-emerald-100 border-emerald-200" }
  ];

  const getDealsForStage = (stage) => {
    return deals.filter(deal => deal.stage === stage);
  };

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId);
    return contact ? contact.name : "Unknown Contact";
  };

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    if (draggedDeal && draggedDeal.stage !== targetStage) {
      onDealStageChange(draggedDeal.Id, targetStage);
    }
    setDraggedDeal(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStageTotal = (stage) => {
    const stageDeals = getDealsForStage(stage);
    return stageDeals.reduce((sum, deal) => sum + deal.value, 0);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stages.map((stage) => {
          const stageDeals = getDealsForStage(stage.id);
          const stageTotal = getStageTotal(stage.id);

          return (
            <Card
              key={stage.id}
              className={`min-h-[600px] ${draggedDeal ? "transition-all duration-200" : ""}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-700">
                    {stage.title}
                  </CardTitle>
                  <Badge variant="default" className="text-xs">
                    {stageDeals.length}
                  </Badge>
                </div>
                <div className="text-lg font-bold text-slate-900">
                  {formatCurrency(stageTotal)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3 pt-0">
                <AnimatePresence>
                  {stageDeals.map((deal) => (
                    <motion.div
                      key={deal.Id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card
                        className={`cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md ${
                          draggedDeal?.Id === deal.Id ? "opacity-50 rotate-2" : ""
                        }`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, deal)}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <h4 className="font-medium text-slate-900 text-sm leading-tight">
                                {deal.title}
                              </h4>
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onDealEdit(deal)}
                                  className="h-6 w-6 p-0"
                                >
                                  <ApperIcon name="Edit2" className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onDealDelete(deal.Id)}
                                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                >
                                  <ApperIcon name="Trash2" className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="text-lg font-bold text-emerald-600">
                                {formatCurrency(deal.value)}
                              </div>
                              
                              <div className="text-xs text-slate-600">
                                <ApperIcon name="User" className="inline h-3 w-3 mr-1" />
                                {getContactName(deal.contactId)}
                              </div>
                              
                              <div className="flex items-center justify-between text-xs text-slate-500">
                                <span>{deal.probability}% probability</span>
                                <span>{format(new Date(deal.expectedCloseDate), "MMM d")}</span>
                              </div>
                              
                              {deal.description && (
                                <p className="text-xs text-slate-600 line-clamp-2">
                                  {deal.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {stageDeals.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    <ApperIcon name="Target" className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No deals in this stage</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineBoard;