import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ username: "", accountNumber: "", password: "" });
  const navigate = useNavigate();

  function onChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // demo: store a token & user in localStorage so ProtectedRoute passes
    localStorage.setItem("bank_token", "demo-token");
    localStorage.setItem("bank_user", JSON.stringify({ fullName: form.username || "Demo User" }));
    alert("Logged in (demo) — token stored in localStorage. Go to Dashboard.");
    navigate("/dashboard");
  }

  return (
    <div>
      <h2>Login (demo)</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" className="form-control mb-2" placeholder="Username" value={form.username} onChange={onChange} />
        <input name="accountNumber" className="form-control mb-2" placeholder="Account number" value={form.accountNumber} onChange={onChange} />
        <input type="password" name="password" className="form-control mb-2" placeholder="Password" value={form.password} onChange={onChange} />
        <button className="btn btn-primary" type="submit">Login</button>
      </form>
    </div>
  );
}
