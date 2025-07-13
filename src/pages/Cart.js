import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { orderAPI, getImageUrl, addressAPI } from "../services/api";
import { useToast } from "../contexts/ToastContext";

const Cart = ({ user }) => {
  const { showToast } = useToast();
  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "",
    name: "",
    address_line: "",
    city: "",
    postal_code: "",
    phone: "",
    is_default: false,
  });
  const [orderData, setOrderData] = useState({
    notes: "",
  });
  const [shippingCost, setShippingCost] = useState(500);

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(cartData);
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await addressAPI.getAll();
      console.log("Address API response:", response);

      // Ensure response.data.data exists and is an array
      const addressesData = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setAddresses(addressesData);

      // Auto-select default address
      const defaultAddress = addressesData.find((addr) => addr.is_default);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      }
    } catch (error) {
      console.log(error);
      showToast("Failed to load addresses", "error");
    }
  };

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
  };

  const handleAddNewAddress = async () => {
    try {
      const response = await addressAPI.create(newAddress);
      setNewAddress({
        label: "",
        name: "",
        address_line: "",
        city: "",
        postal_code: "",
        phone: "",
        is_default: false,
      });
      setShowAddressForm(false);
      await fetchAddresses();

      // Auto-select the newly created address
      if (response.data) {
        const newAddressData = response.data;
        setSelectedAddressId(newAddressData.id);
      }

      showToast("Address added successfully!", "success");
    } catch (error) {
      console.log("Error adding address:", error);
      showToast("Failed to add address", "error");
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }

    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Dispatch custom event to update cart count
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Dispatch custom event to update cart count
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const getTotalPrice = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const handleCheckout = async () => {
    // Validate required fields
    if (!selectedAddressId) {
      showToast("Please select an address", "error");
      return;
    }

    try {
      const items = cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      }));

      await orderAPI.create({
        items,
        address_id: selectedAddressId,
        notes: orderData.notes,
      });

      localStorage.removeItem("cart");
      setCart([]);

      // Dispatch custom event to update cart count
      window.dispatchEvent(new Event("cartUpdated"));

      showToast("Order placed successfully!", "success");
    } catch (error) {
      showToast(
        "Error placing order: " +
          (error.response?.data?.message || "Unknown error"),
        "error"
      );
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container">
        <section className="page-section">
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🛒</div>
            <h1>Your Cart is Empty</h1>
            <p style={{ marginBottom: "2rem", color: "var(--dark-gray)" }}>
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link to="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    // <div className="container">
    <section
      className="page-section"
      style={{
        paddingLeft: "200px",
        paddingRight: "200px",
        backgroundColor: "transparent",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "2rem",
        }}
      >
        {/* Left Column - Cart Items */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <h1 className="section-title" style={{ margin: 0 }}>
              Shopping Cart
            </h1>
            <span style={{ color: "var(--dark-gray)" }}>
              {cart.length} Items
            </span>
          </div>

          <div style={{ display: "grid", gap: "1rem" }}>
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  {item.imageUrl || item.image ? (
                    <img
                      src={item.imageUrl || getImageUrl(item.id)}
                      alt={item.name}
                    />
                  ) : (
                    <div className="cart-image-placeholder">
                      <span>👟</span>
                    </div>
                  )}
                </div>
                <div className="cart-item-info" style={{ flex: 1 }}>
                  <h3>{item.name}</h3>
                  <p
                    style={{
                      color: "var(--accent)",
                      fontWeight: "500",
                      fontSize: "0.9rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {item.brand}
                  </p>
                  <div
                    // className="quantity-control"
                    style={{ marginTop: "0.5rem" }}
                  >
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="btn btn-primary"
                      style={{ width: "20px", height: "20px", padding: "0" }}
                    >
                      -
                    </button>
                    <span style={{ padding: "0 1rem", fontSize: "12px" }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="btn btn-primary"
                      style={{ width: "20px", height: "20px", padding: "0" }}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div style={{ textAlign: "right", marginRight: "1rem" }}>
                  <p style={{ fontSize: "0.9rem", marginBottom: "0.3rem" }}>
                    Unit price: LKR {item.price}
                  </p>
                  <p style={{ fontSize: "0.9rem" }}>
                    Total: LKR {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--dark-gray)",
                    cursor: "pointer",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    padding: "0.5rem",
                  }}
                  onClick={() => removeFromCart(item.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div>
          <div
            style={{
              background: "var(--white)",
              padding: "1.5rem",
              boxShadow: "var(--shadow)",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ marginBottom: "1rem" }}>Order Summary</h3>

            <div
              style={{
                marginBottom: "1rem",
                paddingBottom: "1rem",
                borderBottom: "1px solid var(--border-color)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <span>ITEMS {cart.length}</span>
                <span>LKR {getTotalPrice()}</span>
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                }}
              >
                SHIPPING
              </label>
              <select
                value={shippingCost}
                onChange={(e) => setShippingCost(parseInt(e.target.value))}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid var(--border-color)",
                  borderRadius: "4px",
                }}
              >
                <option value={500}>Standard Delivery - LKR 500.00</option>
                <option value={1000}>Fast Delivery - LKR 1000.00</option>
                <option value={0}>Store Pickup - FREE</option>
              </select>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                }}
              >
                PROMO CODE
              </label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="text"
                  placeholder="Enter your code"
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    border: "1px solid var(--border-color)",
                    borderRadius: "4px",
                  }}
                />
                <button
                  style={{
                    padding: "0.5rem 1rem",
                    background: "var(--accent)",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  APPLY
                </button>
              </div>
            </div>

            <div
              style={{
                paddingTop: "1rem",
                borderTop: "1px solid var(--border-color)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                }}
              >
                <span>TOTAL COST</span>
                <span>
                  LKR {(parseFloat(getTotalPrice()) + shippingCost).toFixed(2)}
                </span>
              </div>
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    marginBottom: "0.5rem",
                    display: "block",
                  }}
                >
                  Shipping Address:
                </label>

                <select
                  value={selectedAddressId}
                  onChange={(e) => handleAddressSelect(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid var(--border-color)",
                    borderRadius: "4px",
                    marginBottom: "0.5rem",
                  }}
                >
                  <option value="">
                    {addresses.length === 0
                      ? "No addresses saved"
                      : "Select an address"}
                  </option>
                  {addresses.map((address) => (
                    <option key={address.id} value={address.id}>
                      {address.label}: {address.address_line}, {address.city}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "var(--accent)",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    marginBottom: "1rem",
                  }}
                >
                  {showAddressForm ? "Cancel" : "Add New Address"}
                </button>

                {showAddressForm && (
                  <div
                    style={{
                      border: "1px solid var(--border-color)",
                      padding: "1rem",
                      borderRadius: "4px",
                      marginBottom: "1rem",
                    }}
                  >
                    <div style={{ marginBottom: "0.5rem" }}>
                      <input
                        type="text"
                        placeholder="Address Label (e.g., Home, Work)"
                        value={newAddress.label}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            label: e.target.value,
                          })
                        }
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          border: "1px solid var(--border-color)",
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                    <div style={{ marginBottom: "0.5rem" }}>
                      <input
                        type="text"
                        placeholder="Recipient Name"
                        value={newAddress.name}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, name: e.target.value })
                        }
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          border: "1px solid var(--border-color)",
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                    <div style={{ marginBottom: "0.5rem" }}>
                      <input
                        type="text"
                        placeholder="Address Line"
                        value={newAddress.address_line}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            address_line: e.target.value,
                          })
                        }
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          border: "1px solid var(--border-color)",
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="City"
                        value={newAddress.city}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, city: e.target.value })
                        }
                        style={{
                          flex: 1,
                          padding: "0.5rem",
                          border: "1px solid var(--border-color)",
                          borderRadius: "4px",
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Postal Code"
                        value={newAddress.postal_code}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            postal_code: e.target.value,
                          })
                        }
                        style={{
                          flex: 1,
                          padding: "0.5rem",
                          border: "1px solid var(--border-color)",
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                    <div style={{ marginBottom: "0.5rem" }}>
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={newAddress.phone}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            phone: e.target.value,
                          })
                        }
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          border: "1px solid var(--border-color)",
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={newAddress.is_default}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            is_default: e.target.checked,
                          })
                        }
                        style={{ marginRight: "0.5rem" }}
                      />
                      Set as default address
                    </label>
                    <button
                      type="button"
                      onClick={handleAddNewAddress}
                      style={{
                        padding: "0.5rem 1rem",
                        background: "var(--accent)",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Save Address
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={handleCheckout}
                style={{
                  width: "100%",
                  padding: "1rem",
                  background: "var(--accent)",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                CHECKOUT
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    // </div>
  );
};

export default Cart;
