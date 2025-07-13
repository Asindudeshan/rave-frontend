import React, { useState, useEffect } from "react";
import { orderAPI, adminAPI } from "../../services/api";
import OrderDetailsPopup from "./OrderDetailsPopup";

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await adminAPI.getAllOrders();
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading orders:", error);
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await adminAPI.updateOrderStatus(orderId, status);
      loadOrders();
    } catch (error) {
      console.error("Error updating order:", error);
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
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="section">
      <div className="section-header">All Orders</div>
      <div className="section-content">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td
                  onClick={() => handleOrderClick(order.id)}
                  style={{ cursor: "pointer" }}
                >
                  #{order.id}
                </td>
                <td
                  onClick={() => handleOrderClick(order.id)}
                  style={{ cursor: "pointer" }}
                >
                  {order.customer_name || "N/A"}
                </td>
                <td
                  onClick={() => handleOrderClick(order.id)}
                  style={{ cursor: "pointer" }}
                >
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td
                  onClick={() => handleOrderClick(order.id)}
                  style={{ cursor: "pointer" }}
                >
                  <span className={`status-${order.status}`}>
                    {order.status}
                  </span>
                </td>
                <td
                  onClick={() => handleOrderClick(order.id)}
                  style={{ cursor: "pointer" }}
                >
                  LKR {Number(order.total_price || 0).toFixed(2)}
                </td>
                <td>
                  {order.status === "pending" && (
                    <>
                      <button
                        className="btn btn-success"
                        onClick={() =>
                          updateOrderStatus(order.id, "processing")
                        }
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-danger"
                        style={{ marginLeft: "10px", marginRight: "10px" }}
                        onClick={() => updateOrderStatus(order.id, "cancelled")}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {order.status === "processing" && (
                    <button
                      className="btn btn-primary"
                      onClick={() => updateOrderStatus(order.id, "shipped")}
                    >
                      Ship
                    </button>
                  )}
                  {order.status === "shipped" && (
                    <button
                      className="btn btn-success"
                      onClick={() => updateOrderStatus(order.id, "delivered")}
                    >
                      Mark Delivered
                    </button>
                  )}
                  <button
                    className="btn btn-info"
                    style={
                      order.status === "shipped" ||
                      order.status === "processing"
                        ? { marginLeft: "10px" }
                        : undefined
                    }
                    onClick={() => handleOrderClick(order.id)}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <OrderDetailsPopup
        orderId={selectedOrderId}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onStatusUpdate={loadOrders}
      />
    </div>
  );
};

export default OrdersTable;
