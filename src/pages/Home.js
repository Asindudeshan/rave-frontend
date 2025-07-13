import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ImageSlider from "../components/ImageSlider";
import PhotoGallery from "../components/PhotoGallery";
import FeaturedProducts from "../components/FeaturedProducts";
import { productAPI } from "../services/api";
import { useToast } from "../contexts/ToastContext";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await productAPI.getAll();
      setFeaturedProducts(response.data.slice(0, 6));
    } catch (error) {
      console.error("Error fetching featured products:", error);
      showToast("Failed to load featured products", "error");
    }
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

  // Hero slider images
  const heroImages = [
    {
      src: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2012&q=80",
      alt: "Premium Shoes Collection",
      caption: "Welcome to Rave Collection",
      description: "M.G.Janma Rashmith's Premium Shoe Store in Kamburupitiya",
    },
    {
      src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      alt: "Sports Shoes",
      caption: "Sports & Athletic Collection",
      description: "High-performance footwear for active lifestyle",
    },
    {
      src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80",
      alt: "Casual Shoes",
      caption: "Casual & Comfort Range",
      description: "Everyday comfort meets style",
    },
  ];

  // Gallery photos
  const galleryPhotos = [
    {
      src: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1112&q=80",
      alt: "Men's Formal Shoes",
      category: "Formal",
      title: "Executive Collection",
    },
    {
      src: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1180&q=80",
      alt: "Women's Heels",
      category: "Women",
      title: "Elegant Heels",
    },
    {
      src: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80",
      alt: "Running Shoes",
      category: "Sports",
      title: "Running Collection",
    },
    {
      src: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1187&q=80",
      alt: "Casual Sneakers",
      category: "Casual",
      title: "Street Style",
    },
    {
      src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      alt: "Boots",
      category: "Boots",
      title: "Winter Collection",
    },
    {
      src: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1459&q=80",
      alt: "Designer Shoes",
      category: "Designer",
      title: "Luxury Line",
    },
  ];

  return (
    <div>
      {/* Hero Slider */}
      <ImageSlider images={heroImages} />

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <FeaturedProducts products={featuredProducts} onAddToCart={addToCart} />
      )}
      {/* Features Section */}
      <section className="page-section">
        <h2 className="section-title">Why Choose Rave Collection?</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
            padding: "0 2rem",
          }}
        >
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>👟</div>
            <h3 style={{ color: "var(--primary)", marginBottom: "1rem" }}>
              Premium Quality
            </h3>
            <p>
              Carefully selected shoes ensuring comfort, style and durability
              for every customer in Kamburupitiya.
            </p>
          </div>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏪</div>
            <h3 style={{ color: "var(--primary)", marginBottom: "1rem" }}>
              Local Store Experience
            </h3>
            <p>
              Visit our physical store at New Shopping Complex or shop online
              seamlessly.
            </p>
          </div>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🤝</div>
            <h3 style={{ color: "var(--primary)", marginBottom: "1rem" }}>
              Trusted Service
            </h3>
            <p>
              M.G.Janma Rashmith's commitment to customer satisfaction and
              quality service since establishment.
            </p>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="container">
        <h2 className="section-title">Our Collection Gallery</h2>
        <PhotoGallery
          photos={galleryPhotos}
          categories={[
            "Formal",
            "Women",
            "Sports",
            "Casual",
            "Boots",
            "Designer",
          ]}
        />
      </section>
    </div>
  );
};

export default Home;
