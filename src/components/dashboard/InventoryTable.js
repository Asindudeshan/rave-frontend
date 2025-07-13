import React, { useState, useEffect } from "react";
import { productAPI, adminAPI } from "../../services/api";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";

const InventoryTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [stockUpdates, setStockUpdates] = useState({});

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productAPI.getAll();
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading products:", error);
      setLoading(false);
    }
  };

  const updateStock = async (productId, stock) => {
    try {
      await adminAPI.updateStock(productId, stock);
      setStockUpdates({ ...stockUpdates, [productId]: stock });
      loadProducts();
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  const handleStockChange = (productId, value) => {
    setStockUpdates({ ...stockUpdates, [productId]: value });
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const deleteProduct = async (productId) => {
    try {
      await productAPI.delete(productId);
      loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  if (loading) {
    return <div className="loading">Loading inventory...</div>;
  }

  return (
    <div className="section">
      <div className="inventory-section-header">
        <span>Inventory Management</span>
        <button
          className="inventory-btn inventory-btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          + Add Product
        </button>
      </div>
      <div className="section-content">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.brand_name || product.brand}</td>
                <td>LKR{Number(product.price || 0).toFixed(2)}</td>
                <td>
                  <input
                    type="number"
                    value={
                      stockUpdates[product.id] !== undefined
                        ? stockUpdates[product.id]
                        : product.stock || 0
                    }
                    onChange={(e) =>
                      handleStockChange(product.id, e.target.value)
                    }
                    className="inventory-stock-input"
                    min="0"
                  />
                </td>
                <td>
                  <button
                    className="inventory-btn inventory-btn-primary inventory-btn-sm"
                    onClick={() =>
                      updateStock(
                        product.id,
                        stockUpdates[product.id] !== undefined
                          ? stockUpdates[product.id]
                          : product.stock
                      )
                    }
                  >
                    Update Stock
                  </button>
                  <button
                    className="inventory-btn inventory-btn-secondary inventory-btn-sm"
                    onClick={() => handleEditProduct(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="inventory-btn inventory-btn-danger inventory-btn-sm"
                    onClick={() => deleteProduct(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <AddProductModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onProductAdded={loadProducts}
        />

        <EditProductModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          product={editingProduct}
          onProductUpdated={loadProducts}
        />
      </div>
    </div>
  );
};

export default InventoryTable;
