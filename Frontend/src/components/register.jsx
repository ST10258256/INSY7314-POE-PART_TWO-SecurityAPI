import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerCustomer } from "../api"; // make sure the path is correct

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    idNumber: "",
    accountNumber: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  function onChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const payload = {
      firstName: form.fullName.split(" ")[0] || form.fullName,
      lastName: form.fullName.split(" ")[1] || "",
      username: form.fullName.replace(/\s+/g, "").toLowerCase(),
      email: `${form.fullName.replace(/\s+/g, "").toLowerCase()}@example.com`,
      idNumber: form.idNumber,
      accountNumber: form.accountNumber,
      password: form.password,
    };

    try {
      const res = await registerCustomer(payload);
      setSuccess("Registered successfully! Redirecting...");
      console.log(res);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={onChange}
        />
        <input
          name="idNumber"
          placeholder="ID Number"
          value={form.idNumber}
          onChange={onChange}
        />
        <input
          name="accountNumber"
          placeholder="Account Number"
          value={form.accountNumber}
          onChange={onChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={onChange}
        />

        {error && <div style={{ color: "red" }}>{error}</div>}
        {success && <div style={{ color: "green" }}>{success}</div>}

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
