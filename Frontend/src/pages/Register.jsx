import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerCustomer } from "../api";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    idNumber: "",
    accountNumber: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  function onChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validate() {
    if (!form.fullName || !form.idNumber || !form.accountNumber || !form.password) {
      return "Please fill all required fields.";
    }
    if (form.password.length < 8) return "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) return setError(v);

    try {
      // send to backend
      const payload = {
        fullName: form.fullName,
        idNumber: form.idNumber,
        accountNumber: form.accountNumber,
        password: form.password
      };
      const resp = await registerCustomer(payload);
      // backend should return success indicator
      if (resp?.success) {
        setSuccess("Registered successfully. Redirecting to login...");
        setTimeout(() => navigate("/login"), 1200);
      } else {
        setError(resp?.message || "Registration failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Registration error - check server.");
    }
  }

  return (
    <div className="card">
      <h2>Customer Registration</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>Full name</label>
        <input name="fullName" value={form.fullName} onChange={onChange} placeholder="John Doe" />

        <label>ID number</label>
        <input name="idNumber" value={form.idNumber} onChange={onChange} placeholder="1234567890123" />

        <label>Account number</label>
        <input name="accountNumber" value={form.accountNumber} onChange={onChange} placeholder="0123456789" />

        <label>Password</label>
        <input type="password" name="password" value={form.password} onChange={onChange} />

        <label>Confirm password</label>
        <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={onChange} />

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <div className="form-actions">
          <button type="submit" className="btn-primary">Register</button>
        </div>
      </form>
    </div>
  );
}
