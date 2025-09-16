import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
const navItems = [
    { to: "/", icon: "BarChart3", label: "Dashboard" },
    { to: "/contacts", icon: "Users", label: "Contacts" },
    { to: "/companies", icon: "Building2", label: "Companies" },
    { to: "/deals", icon: "Target", label: "Deals" },
    { to: "/activities", icon: "Calendar", label: "Activities" }
  ];

  const SidebarContent = () => (
    <div className="h-full flex flex-col gradient-slate">
      <div className="p-6 border-b border-slate-600">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <ApperIcon name="Target" className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Pipeline Pro</h1>
            <p className="text-slate-300 text-sm">CRM System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => onClose && onClose()}
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-emerald-500 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-600 hover:text-white"
              )
            }
          >
            <ApperIcon name={item.icon} className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-600">
        <div className="flex items-center space-x-3 px-4 py-3 text-slate-300">
          <div className="h-8 w-8 rounded-full bg-slate-600 flex items-center justify-center">
            <ApperIcon name="User" className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Sales Team</p>
            <p className="text-xs text-slate-400 truncate">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="w-64 h-screen">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="relative w-64 h-full transform transition-transform duration-300 ease-out">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;