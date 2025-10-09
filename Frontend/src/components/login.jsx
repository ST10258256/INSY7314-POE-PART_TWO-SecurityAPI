import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginCustomer } from "../api"; 

export default function Login() {
  const [form, setForm] = useState({ accountNumber: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); ////////////////
  const navigate = useNavigate();

  function onChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true); ////////////////

    try {
      // Prepare payload matching Swagger LoginDto (username optional) ////////////////
      const loginPayload = { ////////////////
        accountNumber: form.accountNumber, ////////////////
        password: form.password, ////////////////
        // include username only if user provided it (Swagger accepts username too) ////////////////
        ...(form.username ? { username: form.username } : {}) ////////////////
      }; ////////////////

      // Call backend
      // NOTE: replaced inline call to pass full payload matching API
      const res = await loginCustomer(loginPayload); ////////////////

      // The backend returns: { token: "..." }
      const token = res?.token || res?.Token; 
      if (!token) {
        setError("No token returned from server");
        setLoading(false); ////////////////
        return;
      }

      // Store token and user info locally
      localStorage.setItem("bank_token", token);
      if (res?.user) localStorage.setItem("bank_user", JSON.stringify(res.user)); ////////////////

      // Navigate to dashboard
      navigate("/dashboard");

    } catch (err) {
      console.error("Login error:", err);
      // Axios error has err.response.data for backend message
      setError(err.response?.data || err.message || "Login failed");
    } finally {
      setLoading(false); ////////////////
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
      <div className="card shadow-lg" style={{ maxWidth: 420, width: "100%", borderRadius: 12 }}>
        <div className="card-body p-4">
          <div className="text-center mb-3">
            <h3 className="mb-0">Welcome back</h3>
            <small className="text-muted">Sign in to your account</small>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label className="form-label small">Account number</label>
              <input
                name="accountNumber"
                className="form-control"
                placeholder="Enter account number"
                value={form.accountNumber}
                onChange={onChange}
              />
            </div>

            {/* optional username field (API supports it) */} {/* //////////////// */}
            <div className="mb-2">
              <label className="form-label small">Username </label> {/* //////////////// */}
              <input
                name="username" ////////////////
                className="form-control" ////////////////
                placeholder="Username " ////////////////
                value={form.username || ""} ////////////////
                onChange={onChange} ////////////////
              />
            </div>

            <div className="mb-3">
              <label className="form-label small">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Password"
                value={form.password}
                onChange={onChange}
              />
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <small>
                <a href="/forgot" className="text-decoration-none">Forgot password?</a>
              </small>
            </div>

            <button className="btn btn-primary w-100" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
