import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ fullName: "", idNumber: "", accountNumber: "", password: "" });
  const navigate = useNavigate();

  function onChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // placeholder: call backend later
    alert("Registered (placeholder) — now go login");
    navigate("/login");
  }

  return (
    <div>
      <h2>Register (placeholder)</h2>
      <form onSubmit={handleSubmit}>
        <input name="fullName" className="form-control mb-2" placeholder="Full name" value={form.fullName} onChange={onChange} />
        <input name="idNumber" className="form-control mb-2" placeholder="ID number" value={form.idNumber} onChange={onChange} />
        <input name="accountNumber" className="form-control mb-2" placeholder="Account number" value={form.accountNumber} onChange={onChange} />
        <input type="password" name="password" className="form-control mb-2" placeholder="Password" value={form.password} onChange={onChange} />
        <button className="btn btn-primary" type="submit">Register</button>
      </form>
    </div>
  );
}
