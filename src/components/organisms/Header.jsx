import React from "react";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ 
  title, 
  onMenuClick, 
  searchValue, 
  onSearchChange, 
  showSearch = false,
  actions
}) => {
  return (
    <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" className="h-5 w-5" />
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {showSearch && (
            <SearchBar
              value={searchValue}
              onChange={onSearchChange}
              placeholder="Search..."
              className="w-64 hidden sm:block"
            />
          )}
          
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      </div>

      {showSearch && (
        <div className="mt-4 sm:hidden">
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search..."
          />
        </div>
      )}
    </header>
  );
};

export default Header;