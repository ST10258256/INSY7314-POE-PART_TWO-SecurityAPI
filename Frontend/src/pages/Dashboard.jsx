import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("bank_user") || "null");

  function handleLogout() {
    localStorage.removeItem("bank_token");
    localStorage.removeItem("bank_user");
    navigate("/login");
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome {user?.fullName || "Customer"} — demo dashboard.</p>
      <div className="mb-3">
        <Link to="/pay" className="btn btn-success me-2">Make Payment</Link>
        <button className="btn btn-outline-secondary" onClick={handleLogout}>Logout</button>
      </div>

      <h4>Your recent (demo) payments</h4>
      <ul className="list-group">
        {(JSON.parse(localStorage.getItem("demo_payments") || "[]")).map((p, i) => (
          <li key={i} className="list-group-item">
            {p.amount} {p.currency} → {p.payeeAccount} ({p.provider}) — {p.status || "Pending"}
          </li>
        ))}
      </ul>
    </div>
  );
}
