import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import { ToastProvider } from "./contexts/ToastContext";
import "../src/styles/components/dashboard/PromoteUserModal.css";
import "../src/styles/components/dashboard/UsersTable.css";

function App() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Function to calculate cart count
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);

    // Initialize cart count
    updateCartCount();

    // Listen for localStorage changes
    const handleStorageChange = () => {
      updateCartCount();
    };

    window.addEventListener("storage", handleStorageChange);

    // Custom event for same-page cart updates
    window.addEventListener("cartUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleStorageChange);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <ToastProvider>
      <Router>
        <div className="App">
          <Header user={user} logout={logout} cartCount={cartCount} />
          <main>
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route
                  path="/login"
                  element={
                    user ? <Navigate to="/" /> : <Login setUser={setUser} />
                  }
                />
                <Route
                  path="/register"
                  element={
                    user ? <Navigate to="/" /> : <Register setUser={setUser} />
                  }
                />
                <Route
                  path="/cart"
                  element={
                    user ? <Cart user={user} /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/profile"
                  element={
                    user ? <Profile user={user} /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    user &&
                    (user.role === "admin" || user.role === "employee") ? (
                      <Dashboard />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
              </Routes>
            )}
          </main>
          <Footer />
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
