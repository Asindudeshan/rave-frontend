import React, { useState } from "react";
import { getImageUrl } from "../services/api";

const ProductCard = ({ product, onAddToCart, onProductClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className="product-card"
      onClick={() => onProductClick && onProductClick(product)}
      style={{ cursor: "pointer" }}
    >
      <div className="product-image">
        {product.imageUrl || product.image ? (
          <>
            {!imageLoaded && (
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            )}
            <img
              src={getImageUrl(product.id)}
              alt={product.name}
              style={{ display: imageLoaded ? "block" : "none" }}
              onLoad={() => setImageLoaded(true)}
            />
          </>
        ) : (
          <div className="product-placeholder">
            <span>👟</span>
          </div>
        )}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-brand">{product.brand}</p>
        <p className="product-category">{product.category_name}</p>
        <div className="product-details">
          <span className="product-size">Size: {product.size}</span>
          <span className="product-color">Color: {product.color}</span>
        </div>
        <p
          className="product-stock"
          style={{
            color:
              product.stock > 5
                ? "var(--success)"
                : product.stock > 0
                ? "#ffa500"
                : "#dc3545",
            fontSize: "0.9rem",
            fontWeight: "500",
          }}
        >
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>
        <div className="product-footer">
          <span className="product-price">LKR {product.price}</span>
          {product.stock > 0 && (
            <button
              className="btn btn-success add-to-cart"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
