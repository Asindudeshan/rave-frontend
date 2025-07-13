import React, { useState, useEffect } from "react";
import api, { getImageUrl } from "../../services/api";

const EmployeeDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    todayOrders: 0,
    todaySales: 0,
    monthlyStats: [],
  });
  const [orders, setOrders] = useState([]);
  const [bestProducts, setBestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState({
    date_from: "",
    date_to: "",
  });

  useEffect(() => {
    fetchEmployeeData();
  }, [currentPage, dateFilter]);

  const fetchEmployeeData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const statsResponse = await api.get("/orders/employee/stats");
      setStats(statsResponse.data);

      // Fetch orders with filters
      const orderParams = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(dateFilter.date_from && { date_from: dateFilter.date_from }),
        ...(dateFilter.date_to && { date_to: dateFilter.date_to }),
      });

      const ordersResponse = await api.get(
        `/orders/employee/orders?${orderParams}`
      );
      setOrders(ordersResponse.data.orders);
      setPagination(ordersResponse.data.pagination);

      // Fetch best products
      const productsResponse = await api.get("/orders/employee/best-products");
      setBestProducts(productsResponse.data);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilter = () => {
    setCurrentPage(1);
    fetchEmployeeData();
  };

  const clearDateFilter = () => {
    setDateFilter({ date_from: "", date_to: "" });
    setCurrentPage(1);
  };

  const viewOrderDetails = async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      setSelectedOrder(response.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  if (loading && orders.length === 0) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="employee-dashboard">
      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <h3>Total Orders</h3>
          <div className="value">{stats.totalOrders}</div>
        </div>
        <div className="card">
          <h3>Total Sales ( LKR )</h3>
          <div className="value">
            {" "}
            {Number(stats.totalSales || 0).toFixed(2)}
          </div>
        </div>
        <div className="card">
          <h3>Today's Orders</h3>
          <div className="value">{stats.todayOrders}</div>
        </div>
        <div className="card">
          <h3>Today's Sales ( LKR )</h3>
          <div className="value">
            {" "}
            {Number(stats.todaySales || 0).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Date Filter Section */}
      <div className="section">
        <div className="section-header">Filter Orders</div>
        <div className="section-content">
          <div className="filter-controls">
            <input
              type="date"
              value={dateFilter.date_from}
              onChange={(e) =>
                setDateFilter((prev) => ({
                  ...prev,
                  date_from: e.target.value,
                }))
              }
              placeholder="From Date"
            />
            <input
              type="date"
              value={dateFilter.date_to}
              onChange={(e) =>
                setDateFilter((prev) => ({ ...prev, date_to: e.target.value }))
              }
              placeholder="To Date"
            />
            <button onClick={handleDateFilter} className="btn btn-primary">
              Apply Filter
            </button>
            <button onClick={clearDateFilter} className="btn btn-secondary">
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="section">
        <div className="section-header">My Processed Orders</div>
        <div className="section-content">
          {loading ? (
            <div className="loading">Loading orders...</div>
          ) : (
            <>
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.customer_name || "Walk-in Customer"}</td>
                      <td>{new Date(order.created_at).toLocaleDateString()}</td>
                      <td>
                        <span className={`order-type ${order.order_type}`}>
                          {order.order_type?.toUpperCase() || "ONLINE"}
                        </span>
                      </td>
                      <td>LKR {Number(order.total_price).toFixed(2)}</td>
                      <td>
                        <span className={`status ${order.status}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => viewOrderDetails(order.id)}
                          className="btn btn-primary btn-sm"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="btn btn-secondary"
                  >
                    Previous
                  </button>
                  <span className="page-info">
                    Page {currentPage} of {pagination.pages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, pagination.pages)
                      )
                    }
                    disabled={currentPage === pagination.pages}
                    className="btn btn-secondary"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Two Column Layout for Best Products and Monthly Performance */}
      <div className="two-column">
        {/* Best Selling Products */}
        <div className="section">
          <div className="section-header">My Best Selling Products</div>
          <div className="section-content">
            <div className="products-grid">
              {bestProducts.slice(0, 6).map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    {product.imageUrl || product.image ? (
                      <img
                        src={product.imageUrl || getImageUrl(product.id)}
                        alt={product.name}
                      />
                    ) : (
                      <div className="product-placeholder">
                        <span>👟</span>
                      </div>
                    )}
                  </div>
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p className="brand">{product.brand_name}</p>
                    <div className="sales-info">
                      <span className="quantity">
                        Sold: {product.total_sold}
                      </span>
                      <span className="revenue">
                        LKR {Number(product.total_revenue).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Performance */}
        {stats.monthlyStats.length > 0 && (
          <div className="section">
            <div className="section-header">Monthly Performance</div>
            <div className="section-content">
              <div className="chart-container">
                {stats.monthlyStats.slice(0, 6).map((month) => (
                  <div key={month.month} className="month-bar">
                    <div className="bar-container">
                      <div
                        className="bar"
                        style={{
                          height: `${
                            (month.orders_count /
                              Math.max(
                                ...stats.monthlyStats.map((m) => m.orders_count)
                              )) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <div className="month-info">
                      <span className="month-name">{month.month}</span>
                      <span className="month-orders">
                        {month.orders_count} orders
                      </span>
                      <span className="month-sales">
                        LKR {Number(month.total_sales).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order Details #{selectedOrder.id}</h3>
              <button
                className="close-btn"
                onClick={() => setSelectedOrder(null)}
              >
                ×
              </button>
            </div>

            <div className="order-details">
              <div className="order-info">
                <p>
                  <strong>Customer:</strong>{" "}
                  {selectedOrder.customer_name || "Walk-in Customer"}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedOrder.created_at).toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong> {selectedOrder.status}
                </p>
                <p>
                  <strong>Type:</strong>{" "}
                  {selectedOrder.order_type?.toUpperCase() || "ONLINE"}
                </p>
                {selectedOrder.notes && (
                  <p>
                    <strong>Notes:</strong> {selectedOrder.notes}
                  </p>
                )}
              </div>

              <div className="order-items">
                <h4>Items</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items?.map((item, index) => (
                      <tr key={index}>
                        <td>{item.product_name}</td>
                        <td>{item.quantity}</td>
                        <td>LKR {Number(item.price).toFixed(2)}</td>
                        <td>LKR {(item.quantity * item.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="order-total">
                  <strong>
                    Total: LKR {Number(selectedOrder.total_price).toFixed(2)}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
