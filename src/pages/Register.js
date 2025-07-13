import React, { useState } from "react";
import { authAPI } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";

const Register = ({ setUser }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authAPI.register(formData);
      // Auto login after registration
      const loginResponse = await authAPI.login(
        formData.email,
        formData.password
      );
      localStorage.setItem("token", loginResponse.data.token);
      localStorage.setItem("user", JSON.stringify(loginResponse.data.user));
      setUser(loginResponse.data.user);

      showToast(
        "Registration successful! Welcome to Rave Collection.",
        "success"
      );

      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Register</h2>

        {error && (
          <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
        )}

        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%" }}
        >
          Register
        </button>

        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <p>Already have an account?</p>
          <Link to="/login" className="btn btn-secondary">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
