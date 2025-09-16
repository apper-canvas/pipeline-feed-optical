import React, { useState, useEffect, useContext } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import StatCard from "@/components/molecules/StatCard";
import ActivityLog from "@/components/organisms/ActivityLog";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import contactService from "@/services/api/contactService";
import dealService from "@/services/api/dealService";
import activityService from "@/services/api/activityService";
import Chart from "react-apexcharts";

const Dashboard = () => {
  const { toggleSidebar } = useOutletContext();
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
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
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("Dashboard data loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateStats = () => {
    const totalPipelineValue = deals
      .filter(deal => !["Closed Won", "Closed Lost"].includes(deal.stage))
      .reduce((sum, deal) => sum + deal.value, 0);
    
    const closedWonDeals = deals.filter(deal => deal.stage === "Closed Won");
    const totalClosedValue = closedWonDeals.reduce((sum, deal) => sum + deal.value, 0);
    
    const conversionRate = deals.length > 0 
      ? Math.round((closedWonDeals.length / deals.length) * 100)
      : 0;
    
    const recentActivitiesCount = activities.filter(activity => {
      const activityDate = new Date(activity.date);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return activityDate >= sevenDaysAgo;
    }).length;

    return {
      totalPipelineValue,
      totalClosedValue,
      conversionRate,
      recentActivitiesCount
    };
  };

  const getPipelineChartData = () => {
    const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won"];
    const stageData = stages.map(stage => {
      const stageDeals = deals.filter(deal => deal.stage === stage);
      return {
        stage,
        value: stageDeals.reduce((sum, deal) => sum + deal.value, 0),
        count: stageDeals.length
      };
    });

    return {
      series: [{
        name: "Pipeline Value",
        data: stageData.map(d => d.value)
      }],
      options: {
        chart: {
          type: "bar",
          height: 350,
          toolbar: { show: false }
        },
        plotOptions: {
          bar: {
            borderRadius: 6,
            dataLabels: { position: "top" }
          }
        },
        colors: ["#10b981"],
        xaxis: {
          categories: stageData.map(d => d.stage),
          labels: {
            style: { colors: "#64748b", fontSize: "12px" }
          }
        },
        yaxis: {
          labels: {
            style: { colors: "#64748b", fontSize: "12px" },
            formatter: (value) => formatCurrency(value)
          }
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => formatCurrency(val),
          offsetY: -20,
          style: {
            fontSize: "10px",
            colors: ["#475569"]
          }
        },
        grid: {
          borderColor: "#e2e8f0",
          strokeDashArray: 3
        }
      }
    };
  };

  const getActivityChartData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const activityData = last7Days.map(date => {
      const dayActivities = activities.filter(activity => 
        activity.date.split('T')[0] === date
      );
      return dayActivities.length;
    });

    return {
      series: [{
        name: "Activities",
        data: activityData
      }],
      options: {
        chart: {
          type: "line",
          height: 200,
          toolbar: { show: false },
          sparkline: { enabled: true }
        },
        colors: ["#10b981"],
        stroke: {
          curve: "smooth",
          width: 3
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.1,
            stops: [0, 100]
          }
        }
      }
    };
  };

  if (loading) return <Loading type="dashboard" />;
  
  if (error) {
    return (
      <div className="p-6">
        <Header title="Dashboard" onMenuClick={toggleSidebar} />
        <div className="mt-6">
          <Error message={error} onRetry={loadDashboardData} />
        </div>
      </div>
    );
  }

  const stats = calculateStats();
  const pipelineChart = getPipelineChartData();
  const activityChart = getActivityChartData();
  const recentActivities = activities
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title="Dashboard" 
        onMenuClick={toggleSidebar}
        actions={
          <Button size="sm">
            <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        }
      />
      
      <div className="flex-1 p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Pipeline Value"
            value={formatCurrency(stats.totalPipelineValue)}
            change="+12% from last month"
            changeType="positive"
            icon="TrendingUp"
          />
          <StatCard
            title="Closed Deals"
            value={formatCurrency(stats.totalClosedValue)}
            change="+8% from last month"
            changeType="positive"
            icon="Target"
          />
          <StatCard
            title="Conversion Rate"
            value={`${stats.conversionRate}%`}
            change="+3% from last month"
            changeType="positive"
            icon="BarChart3"
          />
          <StatCard
            title="Active Contacts"
            value={contacts.length.toString()}
            change="+15 new this month"
            changeType="positive"
            icon="Users"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Pipeline by Stage</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart
                  options={pipelineChart.options}
                  series={pipelineChart.series}
                  type="bar"
                  height={350}
                />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Activity Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="text-2xl font-bold text-slate-900">
                  {stats.recentActivitiesCount}
                </div>
                <p className="text-sm text-slate-500">Activities this week</p>
              </div>
              <Chart
                options={activityChart.options}
                series={activityChart.series}
                type="line"
                height={200}
              />
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <ActivityLog 
          activities={recentActivities}
          contacts={contacts}
          deals={deals}
        />
      </div>
    </div>
  );
};

export default Dashboard;