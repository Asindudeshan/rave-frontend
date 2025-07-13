import React, { useState, useEffect } from "react";
import { orderAPI, adminAPI } from "../../services/api";
import { getImageUrl } from "../../services/api";
import { useToast } from "../../contexts/ToastContext";

const OrderDetailsPopup = ({ orderId, isOpen, onClose, onStatusUpdate }) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen && orderId) {
      loadOrderDetails();
    }
  }, [isOpen, orderId]);

  const loadOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await orderAPI.getById(orderId);
      setOrderDetails(response.data);
      setSelectedStatus(response.data.status);
    } catch (error) {
      console.error("Error loading order details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await adminAPI.updateOrderStatus(orderId, selectedStatus);
      setOrderDetails((prev) => ({ ...prev, status: selectedStatus }));
      showToast("Order status updated successfully!", "success");
      if (onStatusUpdate) {
        onStatusUpdate();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      showToast("Failed to update order status", "error");
    }
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="popup-overlay" onClick={handleBackdropClick}>
      <div className="popup-content">
        <div className="popup-header">
          <h2>Order Details</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading order details...</div>
        ) : orderDetails ? (
          <div className="popup-body">
            <div className="order-info">
              <h3>Order Information</h3>
              <p>
                <strong>Order ID:</strong> #{orderDetails.id}
              </p>
              <p>
                <strong>Customer:</strong> {orderDetails.customer_name}
              </p>
              <p>
                <strong>Email:</strong> {orderDetails.customer_email}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(orderDetails.created_at).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong>
                <div className="status-dropdown-container">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="status-dropdown"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button
                    onClick={handleStatusUpdate}
                    className="btn btn-primary status-update-btn"
                  >
                    Update
                  </button>
                </div>
              </p>
              <p>
                <strong>Total Amount:</strong> $
                {Number(orderDetails.total_price || 0).toFixed(2)}
              </p>
              <p>
                <strong>Phone:</strong> {orderDetails.phone || "N/A"}
              </p>
              <p>
                <strong>Shipping Address:</strong>{" "}
                {orderDetails.address_line
                  ? `${
                      orderDetails.recipient_name || orderDetails.customer_name
                    }, ${orderDetails.address_line}, ${orderDetails.city}${
                      orderDetails.postal_code
                        ? `, ${orderDetails.postal_code}`
                        : ""
                    }`
                  : "N/A"}
              </p>
              {orderDetails.notes && (
                <p>
                  <strong>Notes:</strong> {orderDetails.notes}
                </p>
              )}
            </div>

            <div className="order-items">
              <h3>Order Items</h3>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Brand</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.items?.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="product-info-popup">
                          {item.image && (
                            <img
                              src={getImageUrl(item.image)}
                              alt={item.product_name}
                              className="product-image-small"
                            />
                          )}
                          <span>{item.product_name}</span>
                        </div>
                      </td>
                      <td>{item.brand_name || "N/A"}</td>
                      <td>{item.quantity}</td>
                      <td>${Number(item.price || 0).toFixed(2)}</td>
                      <td>
                        $
                        {(
                          Number(item.price || 0) * Number(item.quantity || 0)
                        ).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>Order not found</div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsPopup;
