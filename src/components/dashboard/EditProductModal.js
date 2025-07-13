import React, { useState, useEffect } from "react";
import {
  productAPI,
  categoryAPI,
  brandAPI,
  colorAPI,
} from "../../services/api";

const EditProductModal = ({ isOpen, onClose, product, onProductUpdated }) => {
  const [formData, setFormData] = useState({
    name: "",
    brand_id: "",
    price: "",
    stock: "",
    category_id: "",
    size: "",
    base_color_id: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && product) {
      setFormData({
        name: product.name || "",
        brand_id: product.brand_id || "",
        price: product.price || "",
        stock: product.stock || "",
        category_id: product.category_id || "",
        size: product.size || "",
        base_color_id: product.base_color_id || "",
        description: product.description || "",
      });
      setCurrentImage(product.imageUrl || null);
      setImageFile(null);
      setImagePreview(null);
      loadCategories();
      loadBrands();
      loadColors();
    }
  }, [isOpen, product]);

  const loadCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const loadBrands = async () => {
    try {
      const response = await brandAPI.getAll();
      setBrands(response.data);
    } catch (error) {
      console.error("Error loading brands:", error);
    }
  };

  const loadColors = async () => {
    try {
      const response = await colorAPI.getAll();
      setColors(response.data);
    } catch (error) {
      console.error("Error loading colors:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key]);
      });

      if (imageFile) {
        submitData.append("image", imageFile);
      }

      await productAPI.update(product.id, submitData);
      onProductUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="inventory-modal-overlay">
      <div className="inventory-modal-content">
        <div className="inventory-modal-header">
          <h2>Edit Product</h2>
          <button className="inventory-modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="inventory-product-form">
          <div className="inventory-form-row">
            <div className="inventory-form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="inventory-form-group">
              <label>Brand *</label>
              <select
                name="brand_id"
                value={formData.brand_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="inventory-form-row">
            <div className="inventory-form-group">
              <label>Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
              />
            </div>
            <div className="inventory-form-group">
              <label>Stock *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          </div>

          <div className="inventory-form-row">
            <div className="inventory-form-group">
              <label>Category *</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="inventory-form-group">
              <label>Size</label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="inventory-form-row">
            <div className="inventory-form-group">
              <label>Color</label>
              <select
                name="base_color_id"
                value={formData.base_color_id}
                onChange={handleChange}
              >
                <option value="">Select Color</option>
                {colors.map((color) => (
                  <option key={color.id} value={color.id}>
                    {color.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="inventory-form-group">
              <label>Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: "100px",
                    maxHeight: "100px",
                    marginTop: "5px",
                    objectFit: "cover",
                  }}
                />
              )}
              {!imagePreview && currentImage && (
                <img
                  src={currentImage}
                  alt="Current"
                  style={{
                    maxWidth: "100px",
                    maxHeight: "100px",
                    marginTop: "5px",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>
          </div>

          <div className="inventory-form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="inventory-form-actions">
            <button
              type="button"
              onClick={onClose}
              className="inventory-btn inventory-btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inventory-btn inventory-btn-primary"
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
