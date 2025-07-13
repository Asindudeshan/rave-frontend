import React from "react";
import ProductCard from "./ProductCard";

const FeaturedProducts = ({ products, onAddToCart }) => {
  const featuredProducts = products.slice(0, 6); // Show first 6 products as featured

  return (
    <section className="featured-products">
      <div className="container">
        <h2 className="section-title">Featured Products</h2>
        <div className="featured-grid">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
