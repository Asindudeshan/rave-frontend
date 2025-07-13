import React, { useState } from "react";
import { authAPI } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const response = await authAPI.login(formData.email, formData.password);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);

      showToast("Login successful! Welcome back.", "success");

      // Redirect admin to dashboard, regular users to home
      if (response.data.user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Login</h2>

        {error && (
          <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
        )}

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

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%" }}
        >
          Login
        </button>

        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <p>Don't have an account?</p>
          <Link to="/register" className="btn btn-secondary">
            Create Account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
