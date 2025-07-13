import React, { useState, useEffect } from "react";
import api, { getImageUrl } from "../../services/api";

const POSSystem = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerId, setCustomerId] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [cart]);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const calculateTotal = () => {
    const totalAmount = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotal(totalAmount);
  };

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(
      cart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const processSale = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    // Ask for customer phone number
    const phone = prompt("Enter customer mobile number (optional):");
    let customerUserId = null;

    // If phone number provided, check if user exists
    if (phone && phone.trim()) {
      try {
        const response = await api.get(`/auth/by-phone/${phone}`);
        if (response.data && response.data.id) {
          customerUserId = response.data.id;
          alert(`Customer found: ${response.data.name}`);
        }
      } catch (error) {
        // User not found, use default user ID (1)
        customerUserId = 1;
        console.log("Customer not found in system, using default user ID");
      }
    }

    setLoading(true);
    try {
      const orderData = {
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        order_type: "pos",
        employee_id: user.id,
        customer_id: customerUserId,
        customer_phone: phone && phone.trim() ? phone.trim() : null,
      };

      const response = await api.post("/orders/pos", orderData);

      if (response.status === 201) {
        alert(`Sale completed! Order ID: ${response.data.orderId}`);
        setCart([]);
        setCustomerPhone("");
        setCustomerId(null);
        fetchProducts(); // Refresh to update stock
      }
    } catch (error) {
      console.error("Error processing sale:", error);

      alert("Error processing sale. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toString().includes(searchTerm)
  );

  return (
    <div className="pos-system">
      <div className="pos-grid">
        {/* Products Section */}
        <div className="pos-products">
          <div className="pos-search">
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="products-list">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="product-list-item"
                onClick={() => addToCart(product)}
              >
                <div className="product-image-small">
                  {product.imageUrl || product.image ? (
                    <img
                      src={product.imageUrl || getImageUrl(product.id)}
                      alt={product.name}
                    />
                  ) : (
                    <div className="product-placeholder-small">
                      <span>👟</span>
                    </div>
                  )}
                </div>
                <div className="product-details">
                  <h4 className="product-name">{product.name}</h4>
                  <div className="product-info-row">
                    <span className="product-stock">
                      Stock: {product.stock}
                    </span>
                    <span className="product-price">LKR {product.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="pos-cart">
          <h3>Cart</h3>

          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>LKR {item.price}</p>
                </div>

                <div className="quantity-controls">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="qty-btn"
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>

                <div className="item-total">
                  LKR {(item.price * item.quantity).toFixed(2)}
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="remove-btn"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="cart-footer">
            <div className="total">
              <h3>Total: LKR {total.toFixed(2)}</h3>
            </div>

            <button
              onClick={processSale}
              disabled={cart.length === 0 || loading}
              className="process-sale-btn"
            >
              {loading ? "Processing..." : "Process Sale"}
            </button>

            <button
              onClick={() => setCart([])}
              disabled={cart.length === 0}
              className="clear-cart-btn"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSSystem;
