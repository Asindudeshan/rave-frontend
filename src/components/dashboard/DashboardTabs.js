import React from "react";

const DashboardTabs = ({
  activeTab,
  setActiveTab,
  canAccessOrdersAndInventory,
  isAdmin,
  isEmployee,
}) => (
  <div className="dashboard-tabs">
    {isAdmin && (
      <button
        className={activeTab === "overview" ? "tab active" : "tab"}
        onClick={() => setActiveTab("overview")}
      >
        Overview
      </button>
    )}

    {isEmployee && !isAdmin && (
      <button
        className={activeTab === "employee" ? "tab active" : "tab"}
        onClick={() => setActiveTab("employee")}
      >
        My Dashboard
      </button>
    )}

    {canAccessOrdersAndInventory && (
      <button
        className={activeTab === "orders" ? "tab active" : "tab"}
        onClick={() => setActiveTab("orders")}
      >
        Orders
      </button>
    )}

    {canAccessOrdersAndInventory && (
      <button
        className={activeTab === "pos" ? "tab active" : "tab"}
        onClick={() => setActiveTab("pos")}
      >
        POS
      </button>
    )}

    {canAccessOrdersAndInventory && (
      <button
        className={activeTab === "inventory" ? "tab active" : "tab"}
        onClick={() => setActiveTab("inventory")}
      >
        Inventory
      </button>
    )}

    {isAdmin && (
      <button
        className={activeTab === "users" ? "tab active" : "tab"}
        onClick={() => setActiveTab("users")}
      >
        Users
      </button>
    )}

    {isAdmin && (
      <button
        className={activeTab === "employee-management" ? "tab active" : "tab"}
        onClick={() => setActiveTab("employee-management")}
      >
        Employee Management
      </button>
    )}
  </div>
);

export default DashboardTabs;
