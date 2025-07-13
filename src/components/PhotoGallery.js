import React, { useState } from "react";

const PhotoGallery = ({ photos, categories = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredPhotos =
    selectedCategory === "all"
      ? photos
      : photos.filter((photo) => photo.category === selectedCategory);

  const openLightbox = (photo) => {
    setSelectedImage(photo);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <div className="photo-gallery">
      {categories.length > 0 && (
        <div className="gallery-filters">
          <button
            className={`filter-btn ${
              selectedCategory === "all" ? "active" : ""
            }`}
            onClick={() => setSelectedCategory("all")}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <div className="gallery-grid">
        {filteredPhotos.map((photo, index) => (
          <div
            key={index}
            className="gallery-item"
            onClick={() => openLightbox(photo)}
          >
            <img src={photo.src} alt={photo.alt} />
            <div className="gallery-overlay">
              <span>👁️</span>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="lightbox-close" onClick={closeLightbox}>
              ×
            </button>
            <img src={selectedImage.src} alt={selectedImage.alt} />
            {selectedImage.title && <h3>{selectedImage.title}</h3>}
            {selectedImage.description && <p>{selectedImage.description}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
