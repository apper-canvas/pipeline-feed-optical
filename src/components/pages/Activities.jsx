import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import ActivityLog from "@/components/organisms/ActivityLog";
import ActivityModal from "@/components/organisms/ActivityModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import activityService from "@/services/api/activityService";
import contactService from "@/services/api/contactService";
import dealService from "@/services/api/dealService";

const Activities = () => {
  const { toggleSidebar } = useOutletContext();
  const [activities, setActivities] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterOutcome, setFilterOutcome] = useState("");
  
  // Modal states
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [activitiesData, contactsData, dealsData] = await Promise.all([
        activityService.getAll(),
        contactService.getAll(),
        dealService.getAll()
      ]);
      
      setActivities(activitiesData);
      setContacts(contactsData);
      setDeals(dealsData);
      setFilteredActivities(activitiesData);
    } catch (err) {
      setError("Failed to load activities. Please try again.");
      console.error("Activities loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  useEffect(() => {
    let filtered = [...activities];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(activity =>
        activity.subject.toLowerCase().includes(query) ||
        activity.notes.toLowerCase().includes(query) ||
        activity.type.toLowerCase().includes(query)
      );
    }

    // Type filter
    if (filterType) {
      filtered = filtered.filter(activity => activity.type === filterType);
    }

    // Outcome filter
    if (filterOutcome) {
      filtered = filtered.filter(activity => activity.outcome === filterOutcome);
    }

    setFilteredActivities(filtered);
  }, [searchQuery, filterType, filterOutcome, activities]);

  const handleNewActivity = () => {
    setSelectedActivity(null);
    setIsActivityModalOpen(true);
  };

  const handleActivitySave = async (activityData) => {
    try {
      if (selectedActivity) {
        // Update existing activity
        const updatedActivity = await activityService.update(selectedActivity.Id, activityData);
        setActivities(prev => prev.map(a => a.Id === selectedActivity.Id ? updatedActivity : a));
        toast.success("Activity updated successfully!");
      } else {
        // Create new activity
        const newActivity = await activityService.create(activityData);
        setActivities(prev => [...prev, newActivity]);
        toast.success("Activity logged successfully!");
      }
      
      setIsActivityModalOpen(false);
      setSelectedActivity(null);
    } catch (err) {
      toast.error("Failed to save activity. Please try again.");
      console.error("Activity save error:", err);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterType("");
    setFilterOutcome("");
  };

  const getActivityStats = () => {
    const today = new Date();
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const todayCount = activities.filter(a => 
      new Date(a.date).toDateString() === today.toDateString()
    ).length;

    const weekCount = activities.filter(a => 
      new Date(a.date) >= thisWeek
    ).length;

    const monthCount = activities.filter(a => 
      new Date(a.date) >= thisMonth
    ).length;

    return { todayCount, weekCount, monthCount };
  };

  if (loading) return <Loading type="default" />;
  
  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header title="Activities" onMenuClick={toggleSidebar} />
        <div className="flex-1 p-6">
          <Error message={error} onRetry={loadActivities} />
        </div>
      </div>
    );
  }

  const stats = getActivityStats();
  const hasActiveFilters = searchQuery || filterType || filterOutcome;

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title="Activities" 
        onMenuClick={toggleSidebar}
        showSearch={true}
        searchValue={searchQuery}
        onSearchChange={handleSearchChange}
        actions={
          <Button onClick={handleNewActivity}>
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Log Activity
          </Button>
        }
      />
      
      <div className="flex-1 p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Today</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.todayCount}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <ApperIcon name="Calendar" className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">This Week</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.weekCount}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <ApperIcon name="TrendingUp" className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">This Month</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.monthCount}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <ApperIcon name="BarChart3" className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Filter Activities</CardTitle>
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <ApperIcon name="X" className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Activity Type
                </label>
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="Call">Call</option>
                  <option value="Email">Email</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Note">Note</option>
                  <option value="Task">Task</option>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Outcome
                </label>
                <Select
                  value={filterOutcome}
                  onChange={(e) => setFilterOutcome(e.target.value)}
                >
                  <option value="">All Outcomes</option>
                  <option value="Completed">Completed</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="In Progress">In Progress</option>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activities List */}
        {filteredActivities.length === 0 ? (
          <Empty 
            title={hasActiveFilters ? "No activities match your filters" : "No activities logged yet"}
            description={hasActiveFilters ? "Try adjusting your search or filter criteria" : "Start tracking your customer interactions by logging your first activity"}
            action={!hasActiveFilters ? handleNewActivity : undefined}
            actionLabel="Log Activity"
            icon="Calendar"
          />
        ) : (
          <ActivityLog 
            activities={filteredActivities}
            contacts={contacts}
            deals={deals}
          />
        )}
      </div>

      <ActivityModal
        activity={selectedActivity}
        contacts={contacts}
        deals={deals}
        isOpen={isActivityModalOpen}
        onClose={() => {
          setIsActivityModalOpen(false);
          setSelectedActivity(null);
        }}
        onSave={handleActivitySave}
      />
    </div>
  );
};

export default Activities;