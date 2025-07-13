import React, { useState, useEffect } from "react";
import { commissionAPI } from "../../services/api";

import "../../styles/components/dashboard/EmployeeManagement.css";

const EmployeeManagement = () => {
  const [activeSubTab, setActiveSubTab] = useState("overview");
  const [commissionRates, setCommissionRates] = useState([]);
  const [employeeCommissions, setEmployeeCommissions] = useState([]);
  const [commissionSummary, setCommissionSummary] = useState({});
  const [loading, setLoading] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);
  const [editingRate, setEditingRate] = useState(null);
  const [calculationData, setCalculationData] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  useEffect(() => {
    fetchCommissionSummary();
    fetchCommissionRates();
    fetchEmployeeCommissions();
  }, []);

  const fetchCommissionSummary = async () => {
    try {
      const response = await commissionAPI.getSummary();
      setCommissionSummary(response.data);
    } catch (error) {
      console.error("Error fetching commission summary:", error);
    }
  };

  const fetchCommissionRates = async () => {
    try {
      const response = await commissionAPI.getRates();
      setCommissionRates(response.data);
    } catch (error) {
      console.error("Error fetching commission rates:", error);
    }
  };

  const fetchEmployeeCommissions = async () => {
    try {
      const response = await commissionAPI.getEmployeeCommissions();
      setEmployeeCommissions(response.data);
    } catch (error) {
      console.error("Error fetching employee commissions:", error);
    }
  };

  const calculateCommissions = async () => {
    setLoading(true);
    try {
      const response = await commissionAPI.calculate(calculationData);
      alert(
        `Commissions calculated successfully for ${calculationData.month}/${calculationData.year}`
      );
      fetchEmployeeCommissions();
      fetchCommissionSummary();
    } catch (error) {
      console.error("Error calculating commissions:", error);
      alert("Error calculating commissions");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRate = async (rateData) => {
    try {
      if (editingRate) {
        await commissionAPI.updateRate(editingRate.id, rateData);
      } else {
        await commissionAPI.createRate(rateData);
      }
      fetchCommissionRates();
      setShowRateModal(false);
      setEditingRate(null);
    } catch (error) {
      console.error("Error saving commission rate:", error);
      alert("Error saving commission rate");
    }
  };

  const handleDeleteRate = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this commission rate?")
    ) {
      try {
        await commissionAPI.deleteRate(id);
        fetchCommissionRates();
      } catch (error) {
        console.error("Error deleting commission rate:", error);
        alert("Error deleting commission rate");
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "LKR",
    }).format(amount);
  };

  const formatPercentage = (rate) => {
    return (rate * 100).toFixed(2) + "%";
  };

  return (
    <div className="employee-management">
      <h2>Employee Management</h2>

      <div className="management-tabs">
        <button
          className={activeSubTab === "overview" ? "active" : ""}
          onClick={() => setActiveSubTab("overview")}
        >
          Overview
        </button>
        <button
          className={activeSubTab === "rates" ? "active" : ""}
          onClick={() => setActiveSubTab("rates")}
        >
          Commission Rates
        </button>
        <button
          className={activeSubTab === "commissions" ? "active" : ""}
          onClick={() => setActiveSubTab("commissions")}
        >
          Employee Commissions
        </button>
        <button
          className={activeSubTab === "calculate" ? "active" : ""}
          onClick={() => setActiveSubTab("calculate")}
        >
          Calculate Commissions
        </button>
      </div>

      {activeSubTab === "overview" && (
        <div className="overview-section">
          <div className="summary-cards">
            <div className="summary-card">
              <h3>Current Month Commissions</h3>
              <p className="amount">
                {formatCurrency(commissionSummary.current_month_total || 0)}
              </p>
              <small>
                {commissionSummary.month}/{commissionSummary.year}
              </small>
            </div>
            <div className="summary-card">
              <h3>Year to Date Commissions</h3>
              <p className="amount">
                {formatCurrency(commissionSummary.current_year_total || 0)}
              </p>
              <small>{commissionSummary.year}</small>
            </div>
          </div>

          {commissionSummary.top_employees &&
            commissionSummary.top_employees.length > 0 && (
              <div className="top-employees">
                <h3>Top Performers This Month</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Total Sales</th>
                      <th>Commission</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commissionSummary.top_employees.map((employee, index) => (
                      <tr key={index}>
                        <td>{employee.name}</td>
                        <td>{formatCurrency(employee.total_sales)}</td>
                        <td>{formatCurrency(employee.commission_amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>
      )}

      {activeSubTab === "rates" && (
        <div className="rates-section">
          <div className="section-header">
            <h3>Commission Rates</h3>
            <button
              className="btn-primary"
              onClick={() => {
                setEditingRate(null);
                setShowRateModal(true);
              }}
            >
              Add New Rate
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Sales Range</th>
                <th>Commission Rate</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {commissionRates.map((rate) => (
                <tr key={rate.id}>
                  <td>{rate.name}</td>
                  <td>
                    {formatCurrency(rate.min_sales)} -{" "}
                    {rate.max_sales
                      ? formatCurrency(rate.max_sales)
                      : "Unlimited"}
                  </td>
                  <td>{formatPercentage(rate.commission_rate)}</td>
                  <td>
                    <span
                      className={`status ${
                        rate.is_active ? "active" : "inactive"
                      }`}
                    >
                      {rate.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => {
                        setEditingRate(rate);
                        setShowRateModal(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteRate(rate.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSubTab === "commissions" && (
        <div className="commissions-section">
          <h3>Employee Commissions</h3>
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Period</th>
                <th>Total Sales</th>
                <th>Commission Rate</th>
                <th>Commission Amount</th>
                <th>Rate Applied</th>
              </tr>
            </thead>
            <tbody>
              {employeeCommissions.map((commission) => (
                <tr key={commission.id}>
                  <td>{commission.employee_name}</td>
                  <td>
                    {commission.month}/{commission.year}
                  </td>
                  <td>{formatCurrency(commission.total_sales)}</td>
                  <td>{formatPercentage(commission.commission_rate)}</td>
                  <td>{formatCurrency(commission.commission_amount)}</td>
                  <td>{commission.commission_rate_name || "No Rate"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSubTab === "calculate" && (
        <div className="calculate-section">
          <h3>Calculate Monthly Commissions</h3>
          <div className="calculation-form">
            <div className="form-group">
              <label>Year:</label>
              <input
                type="number"
                value={calculationData.year}
                onChange={(e) =>
                  setCalculationData({
                    ...calculationData,
                    year: parseInt(e.target.value),
                  })
                }
                min="2020"
                max="2030"
              />
            </div>
            <div className="form-group">
              <label>Month:</label>
              <select
                value={calculationData.month}
                onChange={(e) =>
                  setCalculationData({
                    ...calculationData,
                    month: parseInt(e.target.value),
                  })
                }
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("default", {
                      month: "long",
                    })}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="btn-primary"
              onClick={calculateCommissions}
              disabled={loading}
            >
              {loading ? "Calculating..." : "Calculate Commissions"}
            </button>
          </div>
          <p className="calculation-note">
            This will calculate commissions for all employees based on their
            sales in the selected month. Existing commission records for the
            same period will be updated.
          </p>
        </div>
      )}

      {showRateModal && (
        <CommissionRateModal
          rate={editingRate}
          onSave={handleSaveRate}
          onClose={() => {
            setShowRateModal(false);
            setEditingRate(null);
          }}
        />
      )}
    </div>
  );
};

const CommissionRateModal = ({ rate, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: rate?.name || "",
    min_sales: rate?.min_sales || 0,
    max_sales: rate?.max_sales || "",
    commission_rate: rate ? rate.commission_rate * 100 : 0, // Convert from decimal to percentage for display
    is_active: rate?.is_active !== undefined ? rate.is_active : true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || formData.commission_rate <= 0) {
      alert("Please fill in all required fields");
      return;
    }

    const submitData = {
      ...formData,
      commission_rate: parseFloat(formData.commission_rate) / 100, // Convert percentage to decimal
      min_sales: parseFloat(formData.min_sales),
      max_sales: formData.max_sales ? parseFloat(formData.max_sales) : null,
    };

    onSave(submitData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{rate ? "Edit Commission Rate" : "Add Commission Rate"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Basic, Premium"
              required
            />
          </div>

          <div className="form-group">
            <label>Minimum Sales Amount *</label>
            <input
              type="number"
              step="0.01"
              value={formData.min_sales}
              onChange={(e) =>
                setFormData({ ...formData, min_sales: e.target.value })
              }
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Maximum Sales Amount</label>
            <input
              type="number"
              step="0.01"
              value={formData.max_sales}
              onChange={(e) =>
                setFormData({ ...formData, max_sales: e.target.value })
              }
              placeholder="Leave empty for unlimited"
            />
          </div>

          <div className="form-group">
            <label>Commission Rate (%) *</label>
            <input
              type="number"
              step="0.01"
              value={formData.commission_rate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  commission_rate: parseFloat(e.target.value),
                })
              }
              min="0"
              max="100"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
              />
              Active
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {rate ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeManagement;
