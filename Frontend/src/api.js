// src/api.js
const BASE = import.meta.env.VITE_API_BASE || ""; // e.g. "http://localhost:5000"

/**
 * Generic fetch wrapper that returns { status, ok, data }
 */
async function request(path, method = "GET", body = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const opts = { method, headers };
  if (body !== null) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, opts);

  let data = null;
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    try { data = await res.json(); } catch (e) { data = null; }
  } else {
    // try text fallback
    try { data = await res.text(); } catch (e) { data = null; }
  }

  return { status: res.status, ok: res.ok, data };
}

/**
 * Register - matches RegisterDto:
 * { firstName, lastName, username, idNumber, accountNumber, email, password }
 */
export async function register(payload) {
  return request("/api/Auth/register", "POST", payload);
}

/**
 * Login - matches LoginDto:
 * { username, accountNumber, password }
 */
export async function login(payload) {
  return request("/api/Auth/login", "POST", payload);
}

/**
 * Submit Payment - PaymentDto:
 * { amount, currency, swiftCode, accountNumber }
 */
export async function submitPayment(payload, token) {
  return request("/api/Payments", "POST", payload, token);
}

/**
 * Get Payments
 */
export async function getPayments(token) {
  return request("/api/Payments", "GET", null, token);
}
