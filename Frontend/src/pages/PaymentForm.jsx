import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentForm() {
  const [form, setForm] = useState({
    amount: "",
    currency: "ZAR",
    provider: "SWIFT",
    payeeAccount: "",
    swiftCode: ""
  });
  const navigate = useNavigate();

  function onChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // demo storage
    const payments = JSON.parse(localStorage.getItem("demo_payments") || "[]");
    payments.unshift({
      amount: form.amount,
      currency: form.currency,
      provider: form.provider,
      payeeAccount: form.payeeAccount,
      swiftCode: form.swiftCode,
      createdAt: new Date().toISOString(),
      status: "Pending"
    });
    localStorage.setItem("demo_payments", JSON.stringify(payments));
    alert("Payment saved locally (demo). It will appear on the dashboard.");
    navigate("/dashboard");
  }

  return (
    <div className="card p-3">
      <h2>Make International Payment (demo)</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Amount</label>
          <input name="amount" value={form.amount} onChange={onChange} type="number" step="0.01" className="form-control" />
        </div>

        <div className="mb-3">
          <label className="form-label">Currency</label>
          <select name="currency" value={form.currency} onChange={onChange} className="form-select">
            <option value="ZAR">ZAR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Provider</label>
          <select name="provider" value={form.provider} onChange={onChange} className="form-select">
            <option value="SWIFT">SWIFT</option>
            <option value="ProviderA">ProviderA</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Payee Account</label>
          <input name="payeeAccount" value={form.payeeAccount} onChange={onChange} className="form-control" />
        </div>

        <div className="mb-3">
          <label className="form-label">SWIFT Code (if using SWIFT)</label>
          <input name="swiftCode" value={form.swiftCode} onChange={onChange} className="form-control" />
        </div>

        <button className="btn btn-primary" type="submit">Pay Now</button>
      </form>
    </div>
  );
}
