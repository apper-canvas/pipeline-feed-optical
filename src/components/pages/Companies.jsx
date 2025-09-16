import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import CompanyTable from "@/components/organisms/CompanyTable";
import CompanyModal from "@/components/organisms/CompanyModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import companyService from "@/services/api/companyService";

const Companies = () => {
  const { toggleSidebar } = useOutletContext();
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal states
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError("");
      
      const companiesData = await companyService.getAll();
      
      setCompanies(companiesData);
      setFilteredCompanies(companiesData);
    } catch (err) {
      setError("Failed to load companies. Please try again.");
      console.error("Companies loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = companies.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.website.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCompanies(filtered);
    } else {
      setFilteredCompanies(companies);
    }
  }, [searchQuery, companies]);

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    setIsEditing(false);
    setIsCompanyModalOpen(true);
  };

  const handleCompanyEdit = (company) => {
    setSelectedCompany(company);
    setIsEditing(true);
    setIsCompanyModalOpen(true);
  };

  const handleNewCompany = () => {
    setSelectedCompany(null);
    setIsEditing(true);
    setIsCompanyModalOpen(true);
  };

  const handleCompanySave = async (companyData) => {
    try {
      if (selectedCompany) {
        // Update existing company
        const updatedCompany = await companyService.update(selectedCompany.Id, companyData);
        setCompanies(prev => prev.map(c => c.Id === selectedCompany.Id ? updatedCompany : c));
        toast.success("Company updated successfully!");
      } else {
        // Create new company
        const newCompany = await companyService.create(companyData);
        setCompanies(prev => [...prev, newCompany]);
        toast.success("Company created successfully!");
      }
      
      setIsCompanyModalOpen(false);
      setSelectedCompany(null);
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to save company. Please try again.");
      console.error("Company save error:", err);
    }
  };

  const handleCompanyDelete = async (companyId) => {
    if (!window.confirm("Are you sure you want to delete this company?")) {
      return;
    }

    try {
      await companyService.delete(companyId);
      setCompanies(prev => prev.filter(c => c.Id !== companyId));
      toast.success("Company deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete company. Please try again.");
      console.error("Company delete error:", err);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) return <Loading type="table" />;
  
  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header title="Companies" onMenuClick={toggleSidebar} />
        <div className="flex-1 p-6">
          <Error message={error} onRetry={loadCompanies} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title="Companies" 
        onMenuClick={toggleSidebar}
        showSearch={true}
        searchValue={searchQuery}
        onSearchChange={handleSearchChange}
        actions={
          <Button onClick={handleNewCompany}>
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            New Company
          </Button>
        }
      />
      
      <div className="flex-1 p-6">
        {filteredCompanies.length === 0 ? (
          <Empty 
            title={searchQuery ? "No companies found" : "No companies yet"}
            description={searchQuery ? "Try adjusting your search criteria" : "Start by adding your first company"}
            action={!searchQuery ? handleNewCompany : undefined}
            actionLabel="Add Company"
            icon="Building2"
          />
        ) : (
          <CompanyTable
            companies={filteredCompanies}
            onCompanySelect={handleCompanySelect}
            onCompanyEdit={handleCompanyEdit}
            onCompanyDelete={handleCompanyDelete}
          />
        )}
      </div>

      <CompanyModal
        company={selectedCompany}
        isOpen={isCompanyModalOpen}
        onClose={() => {
          setIsCompanyModalOpen(false);
          setSelectedCompany(null);
          setIsEditing(false);
        }}
        onSave={handleCompanySave}
        isEditing={isEditing}
      />
    </div>
  );
};

export default Companies;