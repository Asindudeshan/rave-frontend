import React, { useState, useEffect } from "react";
import { billingAPI } from "../../services/api";

const SummaryCards = () => {
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      const response = await billingAPI.getSummary();
      setSummary(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading summary:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading summary...</div>;
  }

  return (
    <div className="summary-cards">
      <div className="card">
        <h3>Total Orders</h3>
        <div className="value">{summary.total_orders || 0}</div>
      </div>
      <div className="card">
        <h3>Total Revenue</h3>
        <div className="value">
          LKR {(summary.total_revenue || 0).toFixed(2)}
        </div>
      </div>
      <div className="card">
        <h3>Average Order</h3>
        <div className="value">
          LKR {(summary.avg_order_value || 0).toFixed(2)}
        </div>
      </div>
      <div className="card">
        <h3>Total Customers</h3>
        <div className="value">{summary.total_customers || 0}</div>
      </div>
    </div>
  );
};

export default SummaryCards;
