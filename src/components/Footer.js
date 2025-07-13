import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Rave Collection</h3>
            <p>
              M.G.Janma Rashmith's premium shoe store bringing you quality
              footwear with exceptional service and seamless online shopping.
            </p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li style={{ marginBottom: "0.5rem" }}>
                <a
                  href="/products"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  Products
                </a>
              </li>
              <li style={{ marginBottom: "0.5rem" }}>
                <a
                  href="/about"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  About Us
                </a>
              </li>
              <li style={{ marginBottom: "0.5rem" }}>
                <a
                  href="/contact"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact Info</h3>
            <p>📧 info@ravecollection.lk</p>
            <p>📱 +94 77 123 4567</p>
            <p>📍 No.19, New Shopping Complex</p>
            <p style={{ marginLeft: "1.2rem" }}>Kirinda Road, Kamburupitiya</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            &copy; 2025 Rave Collection - M.G.Janma Rashmith. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
