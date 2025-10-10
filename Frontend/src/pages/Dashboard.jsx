import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("bank_user") || "null");
  const token = localStorage.getItem("bank_token");

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function handleLogout() {
    localStorage.removeItem("bank_token");
    localStorage.removeItem("bank_user");
    navigate("/login");
  }

  useEffect(() => {
    async function fetchPayments() {
      if (!token) {
        navigate("/login");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const resp = await axios.get(
          "https://securityapi-x4rg.onrender.com/api/payments",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setPayments(resp.data);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError("Failed to load payments. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, [token, navigate]);

  return (
    <div>
      <h2>Dashboard</h2>
      
      <div className="mb-3">
        <Link to="/pay" className="btn btn-success me-2">Make Payment</Link>
        <button className="btn btn-outline-secondary" onClick={handleLogout}>Logout</button>
      </div>

      <h4>Your recent payments</h4>
      {loading ? (
        <p>Loading payments...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : payments.length === 0 ? (
        <p>No payments yet.</p>
      ) : (
        <ul className="list-group">
          {payments.map((p) => (
            <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                {p.amount} {p.currency} → {p.accountNumber || "Unknown"}  
              </div>
              <span className={`badge ${p.status === "Completed" ? "bg-success" : "bg-warning"}`}>
                {p.status || "Pending"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
