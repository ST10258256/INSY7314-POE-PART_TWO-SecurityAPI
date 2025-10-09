// src/pages/PaymentForm.jsx
import React, { useState } from "react";
import { submitPayment } from "../api";
import { useNavigate } from "react-router-dom";


export default function PaymentForm() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    amount: "",
    currency: "ZAR",
    swiftCode: "",
    accountNumber: auth?.user?.accountNumber ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function onChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError(null);

    if (!form.amount || !form.accountNumber || !form.swiftCode) {
      setError("Amount, account number and SWIFT code are required.");
      return;
    }

    if (!window.confirm(`Send ${form.amount} ${form.currency} to ${form.accountNumber}?`)) return;

    setLoading(true);
    try {
      const payload = {
        amount: Number(form.amount),
        currency: form.currency,
        swiftCode: form.swiftCode,
        accountNumber: form.accountNumber,
      };

      const resp = await submitPayment(payload, auth?.token);
      if (resp?.status >= 200 && resp?.status < 300) {
        // success — go to dashboard (which will re-fetch from API)
        navigate("/dashboard");
      } else {
        throw new Error("Server rejected payment");
      }
    } catch (err) {
      console.error("Payment error:", err);
      const msg = err?.response?.data?.message || err.message || "Payment failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="d-flex justify-content-center" style={{ marginTop: 24 }}>
      <div className="card shadow-sm" style={{ width: 720 }}>
        <div className="card-body">
          <h4>International Payment</h4>
          <form onSubmit={submit}>
            <div className="row g-2">
              <div className="col-md-4">
                <label className="form-label small">Amount</label>
                <input name="amount" type="number" step="0.01" className="form-control" value={form.amount} onChange={onChange} />
              </div>

              <div className="col-md-4">
                <label className="form-label small">Currency</label>
                <select name="currency" className="form-select" value={form.currency} onChange={onChange}>
                  <option>ZAR</option>
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label small">SWIFT code</label>
                <input name="swiftCode" className="form-control" value={form.swiftCode} onChange={onChange} />
              </div>
            </div>

            <div className="row g-2 mt-2">
              <div className="col-md-6">
                <label className="form-label small">Beneficiary account number</label>
                <input name="accountNumber" className="form-control" value={form.accountNumber} onChange={onChange} />
              </div>
            </div>

            {error && <div className="alert alert-danger mt-3 py-2">{error}</div>}

            <div className="mt-3 d-flex gap-2">
              <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Processing…" : "Pay Now"}</button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/dashboard")}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
