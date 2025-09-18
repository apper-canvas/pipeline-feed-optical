import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import PipelineBoard from "@/components/organisms/PipelineBoard";
import DealModal from "@/components/organisms/DealModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import dealService from "@/services/api/dealService";
import contactService from "@/services/api/contactService";

const Deals = () => {
  const { toggleSidebar } = useOutletContext();
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal states
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);

  const loadDeals = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ]);
      
      setDeals(dealsData);
      setContacts(contactsData);
    } catch (err) {
      setError("Failed to load deals. Please try again.");
      console.error("Deals loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeals();
  }, []);

  const handleDealEdit = (deal) => {
    setSelectedDeal(deal);
    setIsDealModalOpen(true);
  };

  const handleNewDeal = () => {
    setSelectedDeal(null);
    setIsDealModalOpen(true);
  };

  const handleDealSave = async (dealData) => {
    try {
      if (selectedDeal) {
        // Update existing deal
        const updatedDeal = await dealService.update(selectedDeal.Id, dealData);
        setDeals(prev => prev.map(d => d.Id === selectedDeal.Id ? updatedDeal : d));
        toast.success("Deal updated successfully!");
      } else {
        // Create new deal
        const newDeal = await dealService.create(dealData);
        setDeals(prev => [...prev, newDeal]);
        toast.success("Deal created successfully!");
      }
      
      setIsDealModalOpen(false);
      setSelectedDeal(null);
    } catch (err) {
      toast.error("Failed to save deal. Please try again.");
      console.error("Deal save error:", err);
    }
  };

  const handleDealDelete = async (dealId) => {
    if (!window.confirm("Are you sure you want to delete this deal?")) {
      return;
    }

    try {
      await dealService.delete(dealId);
      setDeals(prev => prev.filter(d => d.Id !== dealId));
      toast.success("Deal deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete deal. Please try again.");
      console.error("Deal delete error:", err);
    }
  };

  const handleDealStageChange = async (dealId, newStage) => {
    try {
      const updatedDeal = await dealService.updateStage(dealId, newStage);
      setDeals(prev => prev.map(d => d.Id === dealId ? updatedDeal : d));
      toast.success(`Deal moved to ${newStage} stage!`);
    } catch (err) {
      toast.error("Failed to update deal stage. Please try again.");
      console.error("Deal stage update error:", err);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

const getTotalPipelineValue = () => {
    const activeDealStages = ["Lead", "Qualified", "Proposal", "Negotiation"];
    return deals
      .filter(deal => deal && activeDealStages.includes(deal?.stage_c || deal?.stage || ''))
      .reduce((sum, deal) => sum + (deal?.value_c || deal?.value || 0), 0);
  };

  if (loading) return <Loading type="pipeline" />;
  
  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header title="Deals" onMenuClick={toggleSidebar} />
        <div className="flex-1 p-6">
          <Error message={error} onRetry={loadDeals} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title="Deals Pipeline" 
        onMenuClick={toggleSidebar}
        actions={
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-sm text-slate-600">
              Total Pipeline: <span className="font-bold text-emerald-600">
                {formatCurrency(getTotalPipelineValue())}
              </span>
            </div>
            <Button onClick={handleNewDeal}>
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              New Deal
            </Button>
          </div>
        }
      />
      
      <div className="flex-1 p-6">
        {deals.length === 0 ? (
          <Empty 
            title="No deals yet"
            description="Start tracking your sales opportunities by creating your first deal"
            action={handleNewDeal}
            actionLabel="Create Deal"
            icon="Target"
          />
        ) : (
          <PipelineBoard
            deals={deals}
            contacts={contacts}
            onDealEdit={handleDealEdit}
            onDealDelete={handleDealDelete}
            onDealStageChange={handleDealStageChange}
          />
        )}
      </div>

      <DealModal
        deal={selectedDeal}
        contacts={contacts}
        isOpen={isDealModalOpen}
        onClose={() => {
          setIsDealModalOpen(false);
          setSelectedDeal(null);
        }}
        onSave={handleDealSave}
      />
    </div>
  );
};

export default Deals;