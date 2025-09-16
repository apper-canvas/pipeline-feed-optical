import React from "react";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";

const Loading = ({ type = "default" }) => {
  if (type === "dashboard") {
    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-20"></div>
                    <div className="h-8 bg-slate-200 rounded w-16"></div>
                    <div className="h-4 bg-slate-200 rounded w-12"></div>
                  </div>
                  <div className="h-12 w-12 bg-slate-200 rounded-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="animate-pulse">
            <CardHeader className="space-y-3">
              <div className="h-6 bg-slate-200 rounded w-32"></div>
              <div className="h-4 bg-slate-200 rounded w-48"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-slate-200 rounded"></div>
              ))}
            </CardContent>
          </Card>
          
          <Card className="animate-pulse">
            <CardHeader className="space-y-3">
              <div className="h-6 bg-slate-200 rounded w-32"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-64 bg-slate-200 rounded"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (type === "table") {
    return (
      <Card className="animate-pulse">
        <CardHeader className="space-y-3">
          <div className="h-6 bg-slate-200 rounded w-32"></div>
          <div className="h-10 bg-slate-200 rounded w-full"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-slate-200 rounded w-16"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (type === "pipeline") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-3">
              <div className="h-5 bg-slate-200 rounded w-24"></div>
              <div className="h-4 bg-slate-200 rounded w-16"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-24 bg-slate-200 rounded"></div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
    </div>
  );
};

export default Loading;