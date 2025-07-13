import React, { useState, useEffect } from "react";
import { billingAPI } from "../../services/api";

const DailySalesTable = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDailySales();
  }, []);

  const loadDailySales = async () => {
    try {
      const response = await billingAPI.getDailySales();
      setSales(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading daily sales:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading daily sales...</div>;
  }

  return (
    <div className="section">
      <div className="section-header">Daily Sales (Last 7 Days)</div>
      <div className="section-content">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Orders</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale, index) => (
              <tr key={index}>
                <td>{new Date(sale.date).toLocaleDateString()}</td>
                <td>{sale.orders_count}</td>
                <td>${Number(sale.daily_revenue || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailySalesTable;
