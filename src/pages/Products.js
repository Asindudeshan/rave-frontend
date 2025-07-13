import React, { useState, useEffect } from "react";
import {
  productAPI,
  categoryAPI,
  brandAPI,
  sectionAPI,
  genderAPI,
  colorAPI,
  getImageUrl,
} from "../services/api";
import ProductCard from "../components/ProductCard";
import PhotoGallery from "../components/PhotoGallery";
import { useToast } from "../contexts/ToastContext";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "gallery"
  const { showToast } = useToast();

  // Modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Filter options
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sections, setSections] = useState([]);
  const [genders, setGenders] = useState([]);
  const [colors, setColors] = useState([]);

  // Filter state
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    section: "",
    gender: "",
    color: "",
  });

  useEffect(() => {
    fetchFilterOptions();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchFilterOptions = async () => {
    try {
      const [categoriesRes, brandsRes, sectionsRes, gendersRes, colorsRes] =
        await Promise.all([
          categoryAPI.getAll(),
          brandAPI.getAll(),
          sectionAPI.getAll(),
          genderAPI.getAll(),
          colorAPI.getAll(),
        ]);

      setCategories(categoriesRes.data);
      setBrands(brandsRes.data);
      setSections(sectionsRes.data);
      setGenders(gendersRes.data);
      setColors(colorsRes.data);
    } catch (error) {
      console.error("Error fetching filter options:", error);
      showToast("Failed to load filter options", "error");
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll(filters);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      showToast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      brand: "",
      section: "",
      gender: "",
      color: "",
    });
  };

  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // Dispatch custom event to update cart count
    window.dispatchEvent(new Event("cartUpdated"));

    showToast("Product added to cart!", "success");
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  // Convert products to photo gallery format
  const productPhotos = products.map((product) => ({
    src: product.imageUrl || getImageUrl(product.id),
    alt: product.name,
    category: product.category_name || "Other",
    title: product.name,
    description: `${product.brand} - LKR ${product.price}`,
  }));

  if (loading) {
    return (
      <div className="container" style={{ backgroundColor: "transparent" }}>
        <div className="loading">
          <div className="spinner"></div>
          Loading products...
        </div>
      </div>
    );
  }

  return (
    <section
      className="page-section"
      style={{
        paddingLeft: "200px",
        paddingRight: "200px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 className="section-title" style={{ margin: 0 }}>
          Our Products
        </h1>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={filters.brand}
            onChange={(e) => handleFilterChange("brand", e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>

          <select
            value={filters.section}
            onChange={(e) => handleFilterChange("section", e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          >
            <option value="">All Sections</option>
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.name}
              </option>
            ))}
          </select>

          <select
            value={filters.gender}
            onChange={(e) => handleFilterChange("gender", e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          >
            <option value="">All Genders</option>
            {genders.map((gender) => (
              <option key={gender.id} value={gender.id}>
                {gender.name}
              </option>
            ))}
          </select>

          <select
            value={filters.color}
            onChange={(e) => handleFilterChange("color", e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          >
            <option value="">All Colors</option>
            {colors.map((color) => (
              <option key={color.id} value={color.id}>
                {color.name}
              </option>
            ))}
          </select>

          <button
            onClick={clearFilters}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {viewMode === "gallery" ? (
        <PhotoGallery
          photos={productPhotos}
          categories={["Sports", "Formal", "Women", "Casual"]}
        />
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
              onProductClick={handleProductClick}
            />
          ))}
        </div>
      )}

      {products.length === 0 && viewMode === "grid" && (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            color: "var(--dark-gray)",
          }}
        >
          <h3>No products available</h3>
          <p>Check back later for new arrivals!</p>
        </div>
      )}

      {/* Product Details Modal */}
      {showModal && selectedProduct && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={closeModal}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "2rem",
              maxWidth: "800px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: "#666",
              }}
            >
              ×
            </button>

            <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
              <div style={{ flex: "1", minWidth: "250px" }}>
                <img
                  src={
                    selectedProduct.imageUrl || getImageUrl(selectedProduct.id)
                  }
                  alt={selectedProduct.name}
                  style={{
                    width: "100%",
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </div>

              <div style={{ flex: "1", minWidth: "250px" }}>
                <h2 style={{ margin: "0 0 1rem 0", color: "#333" }}>
                  {selectedProduct.name}
                </h2>

                <div style={{ marginBottom: "1rem" }}>
                  <p style={{ margin: "0.5rem 0", fontSize: "1.1rem" }}>
                    <strong>Brand:</strong> {selectedProduct.brand}
                  </p>
                  <p style={{ margin: "0.5rem 0" }}>
                    <strong>Category:</strong> {selectedProduct.category_name}
                  </p>
                  <p style={{ margin: "0.5rem 0" }}>
                    <strong>Section:</strong> {selectedProduct.section_name}
                  </p>
                  <p style={{ margin: "0.5rem 0" }}>
                    <strong>Gender:</strong> {selectedProduct.gender_name}
                  </p>
                  <p style={{ margin: "0.5rem 0" }}>
                    <strong>Size:</strong> {selectedProduct.size}
                  </p>
                  <p style={{ margin: "0.5rem 0" }}>
                    <strong>Color:</strong> {selectedProduct.color}
                  </p>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <p
                    style={{
                      margin: "0.5rem 0",
                      color:
                        selectedProduct.stock > 5
                          ? "var(--success)"
                          : selectedProduct.stock > 0
                          ? "#ffa500"
                          : "#dc3545",
                      fontWeight: "500",
                    }}
                  >
                    <strong>Stock:</strong>{" "}
                    {selectedProduct.stock > 0
                      ? `${selectedProduct.stock} in stock`
                      : "Out of stock"}
                  </p>
                </div>

                {selectedProduct.description && (
                  <div style={{ marginBottom: "1rem" }}>
                    <p style={{ margin: "0.5rem 0" }}>
                      <strong>Description:</strong>
                    </p>
                    <p
                      style={{
                        margin: "0.5rem 0",
                        color: "#666",
                        lineHeight: "1.5",
                      }}
                    >
                      {selectedProduct.description}
                    </p>
                  </div>
                )}

                <div style={{ marginBottom: "1.5rem" }}>
                  <p
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      color: "#333",
                      margin: "0",
                    }}
                  >
                    LKR {selectedProduct.price}
                  </p>
                </div>

                {selectedProduct.stock > 0 && (
                  <button
                    onClick={() => {
                      addToCart(selectedProduct);
                      closeModal();
                    }}
                    style={{
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "1rem",
                      fontWeight: "500",
                      width: "100%",
                    }}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Products;
