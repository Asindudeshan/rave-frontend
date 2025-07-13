import React, { useState, useEffect } from "react";
import { billingAPI } from "../../services/api";

const BestProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBestProducts();
  }, []);

  const loadBestProducts = async () => {
    try {
      const response = await billingAPI.getBestProducts();
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading best products:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading best products...</div>;
  }

  return (
    <div className="section">
      <div className="section-header">Best Selling Products</div>
      <div className="section-content">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Sold</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td>
                  {product.name}
                  <br />
                  <small>{product.brand}</small>
                </td>
                <td>{product.total_sold}</td>
                <td>${Number(product.total_revenue || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BestProductsTable;
