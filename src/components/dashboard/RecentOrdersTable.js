import React, { useState, useEffect } from "react";
import { billingAPI } from "../../services/api";
import OrderDetailsPopup from "./OrderDetailsPopup";

const RecentOrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    loadRecentOrders();
  }, []);

  const loadRecentOrders = async () => {
    try {
      const response = await billingAPI.getRecentOrders();
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading recent orders:", error);
      setLoading(false);
    }
  };

  const handleOrderClick = (orderId) => {
    setSelectedOrderId(orderId);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedOrderId(null);
  };

  if (loading) {
    return <div className="loading">Loading recent orders...</div>;
  }

  return (
    <div className="section">
      <div className="section-header">Recent Orders</div>
      <div className="section-content">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                onClick={() => handleOrderClick(order.id)}
                style={{ cursor: "pointer" }}
              >
                <td>#{order.id}</td>
                <td>{order.customer_name}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>
                  <span className={`status-${order.status}`}>
                    {order.status}
                  </span>
                </td>
                <td>LKR{Number(order.total_amount || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <OrderDetailsPopup
        orderId={selectedOrderId}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onStatusUpdate={loadRecentOrders}
      />
    </div>
  );
};

export default RecentOrdersTable;
