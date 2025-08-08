import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { path: "/", label: "Dashboard", icon: "LayoutDashboard" },
    { path: "/medications", label: "Medications", icon: "Pill" },
    { path: "/appointments", label: "Appointments", icon: "Calendar" },
    { path: "/metrics", label: "Health Metrics", icon: "Activity" }
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-100 bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
              <ApperIcon name="Heart" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display text-surface-900">CareTrack</h1>
              <p className="text-xs text-surface-600">Healthcare Management</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "primary" : "ghost"}
                size="default"
                onClick={() => navigate(item.path)}
                className="flex items-center space-x-2 px-4 py-2"
              >
                <ApperIcon name={item.icon} size={18} />
                <span>{item.label}</span>
              </Button>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="hidden lg:flex items-center space-x-2">
            <Button variant="danger" size="small">
              <ApperIcon name="Phone" size={16} className="mr-2" />
              Emergency
            </Button>
            <Button 
              variant="outline" 
              size="small"
              onClick={() => {
                const { ApperUI } = window.ApperSDK;
                ApperUI.logout();
              }}
            >
              <ApperIcon name="LogOut" size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-surface-100 bg-white">
        <div className="flex items-center justify-around py-2">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors duration-200 ${
                isActive(item.path)
                  ? "text-primary-600 bg-primary-50"
                  : "text-surface-600 hover:text-surface-900"
              }`}
            >
              <ApperIcon name={item.icon} size={20} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;