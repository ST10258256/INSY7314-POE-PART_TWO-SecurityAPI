import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginCustomer } from "../api"; 

export default function Login() {
  const [form, setForm] = useState({ accountNumber: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function onChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      // Call backend
      const res = await loginCustomer({
        accountNumber: form.accountNumber,
        password: form.password
      });

      // The backend returns: { token: "..." }
      const token = res?.token || res?.Token; 
      if (!token) {
        setError("No token returned from server");
        return;
      }

      // Store token and user info locally
      localStorage.setItem("bank_token", token);
    

      // Navigate to dashboard
      navigate("/dashboard");

    } catch (err) {
      console.error("Login error:", err);
      // Axios error has err.response.data for backend message
      setError(err.response?.data || err.message || "Login failed");
    }
  }

  return (
    <div>
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          name="accountNumber"
          className="form-control mb-2"
          placeholder="Account number"
          value={form.accountNumber}
          onChange={onChange}
        />
        <input
          type="password"
          name="password"
          className="form-control mb-2"
          placeholder="Password"
          value={form.password}
          onChange={onChange}
        />
        <button className="btn btn-primary" type="submit">Login</button>
      </form>
    </div>
  );
}
