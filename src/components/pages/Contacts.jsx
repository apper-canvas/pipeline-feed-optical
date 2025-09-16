import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import ContactTable from "@/components/organisms/ContactTable";
import ContactModal from "@/components/organisms/ContactModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import contactService from "@/services/api/contactService";
import dealService from "@/services/api/dealService";
import activityService from "@/services/api/activityService";

const Contacts = () => {
  const { toggleSidebar } = useOutletContext();
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal states
  const [selectedContact, setSelectedContact] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [contactsData, dealsData, activitiesData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        activityService.getAll()
      ]);
      
      setContacts(contactsData);
      setDeals(dealsData);
      setActivities(activitiesData);
      setFilteredContacts(contactsData);
    } catch (err) {
      setError("Failed to load contacts. Please try again.");
      console.error("Contacts loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.position.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  }, [searchQuery, contacts]);

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    setIsEditing(false);
    setIsContactModalOpen(true);
  };

  const handleContactEdit = (contact) => {
    setSelectedContact(contact);
    setIsEditing(true);
    setIsContactModalOpen(true);
  };

  const handleNewContact = () => {
    setSelectedContact(null);
    setIsEditing(true);
    setIsContactModalOpen(true);
  };

  const handleContactSave = async (contactData) => {
    try {
      if (selectedContact) {
        // Update existing contact
        const updatedContact = await contactService.update(selectedContact.Id, contactData);
        setContacts(prev => prev.map(c => c.Id === selectedContact.Id ? updatedContact : c));
        toast.success("Contact updated successfully!");
      } else {
        // Create new contact
        const newContact = await contactService.create(contactData);
        setContacts(prev => [...prev, newContact]);
        toast.success("Contact created successfully!");
      }
      
      setIsContactModalOpen(false);
      setSelectedContact(null);
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to save contact. Please try again.");
      console.error("Contact save error:", err);
    }
  };

  const handleContactDelete = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) {
      return;
    }

    try {
      await contactService.delete(contactId);
      setContacts(prev => prev.filter(c => c.Id !== contactId));
      toast.success("Contact deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete contact. Please try again.");
      console.error("Contact delete error:", err);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) return <Loading type="table" />;
  
  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header title="Contacts" onMenuClick={toggleSidebar} />
        <div className="flex-1 p-6">
          <Error message={error} onRetry={loadContacts} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title="Contacts" 
        onMenuClick={toggleSidebar}
        showSearch={true}
        searchValue={searchQuery}
        onSearchChange={handleSearchChange}
        actions={
          <Button onClick={handleNewContact}>
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            New Contact
          </Button>
        }
      />
      
      <div className="flex-1 p-6">
        {filteredContacts.length === 0 ? (
          <Empty 
            title={searchQuery ? "No contacts found" : "No contacts yet"}
            description={searchQuery ? "Try adjusting your search criteria" : "Start by adding your first contact"}
            action={!searchQuery ? handleNewContact : undefined}
            actionLabel="Add Contact"
            icon="Users"
          />
        ) : (
          <ContactTable
            contacts={filteredContacts}
            onContactSelect={handleContactSelect}
            onContactEdit={handleContactEdit}
            onContactDelete={handleContactDelete}
          />
        )}
      </div>

      <ContactModal
        contact={selectedContact}
        deals={deals}
        activities={activities}
        isOpen={isContactModalOpen}
        onClose={() => {
          setIsContactModalOpen(false);
          setSelectedContact(null);
          setIsEditing(false);
        }}
        onSave={handleContactSave}
        isEditing={isEditing}
      />
    </div>
  );
};

export default Contacts;