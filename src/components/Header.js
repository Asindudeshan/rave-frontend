import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiHome,
  FiGrid,
  FiShoppingCart,
  FiUser,
  FiLogOut,
  FiLogIn,
  FiUserPlus,
  FiSettings,
  FiSearch,
  FiMenu,
  FiX,
} from "react-icons/fi";

const Header = ({ user, logout, cartCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          {/* Center: Logo */}
          <div className="logo">
            <Link to="/">Rave Collection</Link>
          </div>

          {/* Mobile menu button */}
          <button className="mobile-menu-btn" onClick={toggleMenu}>
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>

          {/* Left: Navigation Links */}
          <div className="nav-left">
            <Link to="/" className="nav-link">
              <FiHome />
              <span>Home</span>
            </Link>
            <Link to="/products" className="nav-link">
              <FiGrid />
              <span>Products</span>
            </Link>
          </div>

          {/* Right: Cart and User Actions */}
          <div className="nav-right">
            <Link to="/cart" className="nav-link cart-link">
              <FiShoppingCart />
              <span className="cart-badge">{cartCount || 0}</span>
            </Link>
            {user ? (
              <>
                {(user.role === "admin" || user.role === "employee") && (
                  <Link to="/dashboard" className="nav-link">
                    <FiSettings />
                  </Link>
                )}
                <div className="user-dropdown">
                  <button className="user-btn" onClick={toggleUserDropdown}>
                    <FiUser style={{ fontSize: "1.2rem" }} />
                  </button>
                  {isUserDropdownOpen && (
                    <div className="dropdown-menu">
                      <Link
                        to="/profile"
                        className="dropdown-item"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <FiUser />
                        <span>Profile</span>
                      </Link>
                      <button onClick={logout} className="dropdown-item">
                        <FiLogOut />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/login" className="nav-link">
                <FiLogIn />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="mobile-menu">
              <Link to="/" className="nav-link" onClick={toggleMenu}>
                <FiHome />
                <span>Home</span>
              </Link>
              <Link to="/products" className="nav-link" onClick={toggleMenu}>
                <FiGrid />
                <span>Products</span>
              </Link>
              <Link to="/cart" className="nav-link" onClick={toggleMenu}>
                <FiShoppingCart />
                <span>Cart</span>
              </Link>
              {user ? (
                <>
                  {(user.role === "admin" || user.role === "employee") && (
                    <Link
                      to="/dashboard"
                      className="nav-link"
                      onClick={toggleMenu}
                    >
                      <FiSettings />
                      <span>Dashboard</span>
                    </Link>
                  )}
                  <Link to="/profile" className="nav-link" onClick={toggleMenu}>
                    <FiUser />
                    <span>Profile</span>
                  </Link>
                  <button onClick={logout} className="nav-link">
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-link" onClick={toggleMenu}>
                    <FiLogIn />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="nav-link"
                    onClick={toggleMenu}
                  >
                    <FiUserPlus />
                    <span>Register</span>
                  </Link>
                </>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
