import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api";

export default function Register() {
  // RegisterDto: { firstName, lastName, username, idNumber, accountNumber, email, password }
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    idNumber: "",
    accountNumber: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function onChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    // basic validation
    if (!form.firstName || !form.lastName || !form.username || !form.password || !form.accountNumber) {
      setError("Please fill required fields: first/last name, username, account number and password.");
      return;
    }

    setLoading(true);
    try {
      const resp = await register(form);
      if (resp.ok) {
        alert("Registered successfully — please login.");
        navigate("/login");
      } else {
        const msg = resp.data?.message || `Registration failed (${resp.status})`;
        setError(msg);
      }
    } catch (err) {
      console.error("Register error:", err);
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="firstName" className="form-control mb-2" placeholder="First name" value={form.firstName} onChange={onChange} />
        <input name="lastName" className="form-control mb-2" placeholder="Last name" value={form.lastName} onChange={onChange} />
        <input name="username" className="form-control mb-2" placeholder="Username" value={form.username} onChange={onChange} />
        <input name="idNumber" className="form-control mb-2" placeholder="ID number" value={form.idNumber} onChange={onChange} />
        <input name="accountNumber" className="form-control mb-2" placeholder="Account number" value={form.accountNumber} onChange={onChange} />
        <input name="email" className="form-control mb-2" placeholder="Email" value={form.email} onChange={onChange} />
        <input type="password" name="password" className="form-control mb-2" placeholder="Password" value={form.password} onChange={onChange} />
        {error && <div className="text-danger mb-2 small">{error}</div>}
        <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Registering…" : "Register"}</button>
      </form>
    </div>
  );
}
