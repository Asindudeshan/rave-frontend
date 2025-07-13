import React, { useState, useEffect } from "react";
import {
  DashboardTabs,
  SummaryCards,
  RecentOrdersTable,
  BestProductsTable,
  DailySalesTable,
  OrdersTable,
  InventoryTable,
  UsersTable,
  POSSystem,
  EmployeeDashboard,
  EmployeeManagement,
} from "../components/dashboard";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const isAdmin = user?.role === "admin";
  const isEmployee = user?.role === "employee";
  const canAccessOrdersAndInventory = isAdmin || isEmployee;

  // Set default tab based on user role
  useEffect(() => {
    if (user && user.role === "employee") {
      setActiveTab("employee");
    } else if (user && user.role === "admin") {
      setActiveTab("overview");
    }
  }, [user]);

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <DashboardTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          canAccessOrdersAndInventory={canAccessOrdersAndInventory}
          isAdmin={isAdmin}
          isEmployee={isEmployee}
        />

        {activeTab === "overview" && isAdmin && (
          <>
            <SummaryCards />
            <div className="two-column">
              <RecentOrdersTable />
              <BestProductsTable />
            </div>
            <DailySalesTable />
          </>
        )}

        {activeTab === "employee" && isEmployee && !isAdmin && (
          <EmployeeDashboard />
        )}

        {activeTab === "orders" && canAccessOrdersAndInventory && (
          <OrdersTable />
        )}

        {activeTab === "pos" && canAccessOrdersAndInventory && <POSSystem />}

        {activeTab === "inventory" && canAccessOrdersAndInventory && (
          <InventoryTable />
        )}

        {activeTab === "users" && isAdmin && <UsersTable />}

        {activeTab === "employee-management" && isAdmin && (
          <EmployeeManagement />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
