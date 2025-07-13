import React, { useState } from "react";
import api from "../../services/api";

const PromoteUserModal = ({ isOpen, onClose, onUserPromoted }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.put("/auth/update-role", {
        email: email.trim(),
        role: "employee",
      });

      setEmail("");
      onClose();
      onUserPromoted?.(); // Call the refresh function
    } catch (error) {
      setError(error.response?.data?.message || "Failed to promote user");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Promote User to Employee</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="email">User Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter user email to promote to employee"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !email.trim()}
            >
              {loading ? "Promoting..." : "Promote to Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromoteUserModal;
