import React from "react";

const Loading = ({ type = "default" }) => {
  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-surface-100 rounded-xl p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-8 bg-surface-200 rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                  <div className="h-3 bg-surface-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-surface-200 rounded"></div>
                <div className="h-3 bg-surface-200 rounded w-5/6"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-8 bg-surface-200 rounded w-20"></div>
                <div className="h-8 bg-surface-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "stats") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-surface-100 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-surface-200 rounded w-24"></div>
                  <div className="h-8 bg-surface-200 rounded w-16"></div>
                  <div className="h-3 bg-surface-200 rounded w-20"></div>
                </div>
                <div className="w-12 h-12 bg-surface-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
    </div>
  );
};

export default Loading;