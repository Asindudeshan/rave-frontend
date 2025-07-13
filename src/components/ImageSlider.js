import React from "react";

const ImageSlider = ({ images }) => {
  if (!images || images.length === 0) return null;

  const firstImage = images[0];

  return (
    <div
      className="slider"
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <img
        src={firstImage.src}
        alt={firstImage.alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
      {firstImage.caption && (
        <div
          className="slider-caption"
          style={{
            position: "absolute",
            bottom: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            color: "white",
            zIndex: 1,
          }}
        >
          <h3>{firstImage.caption}</h3>
          {firstImage.description && <p>{firstImage.description}</p>}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
