import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginCustomer } from "../api";
import { saveAuth } from "../auth";

export default function Login() {
  const [form, setForm] = useState({ username: "", accountNumber: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function onChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.username || !form.accountNumber || !form.password) {
      return setError("Please fill all fields.");
    }

    try {
      const resp = await loginCustomer(form); // expected { token, user }
      if (resp?.token && resp?.user) {
        saveAuth({ token: resp.token, user: resp.user });
        navigate("/dashboard");
      } else {
        setError(resp?.message || "Invalid login.");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed - check server.");
    }
  }

  return (
    <div className="card">
      <h2>Customer Login</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>Username</label>
        <input name="username" value={form.username} onChange={onChange} />

        <label>Account number</label>
        <input name="accountNumber" value={form.accountNumber} onChange={onChange} />

        <label>Password</label>
        <input type="password" name="password" value={form.password} onChange={onChange} />

        {error && <div className="error">{error}</div>}

        <div className="form-actions">
          <button type="submit" className="btn-primary">Login</button>
        </div>
      </form>
    </div>
  );
}
