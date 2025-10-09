// frontend/src/api.js
import axios from "axios";

/**
 * Axios instance.
 * Using baseURL "/api" so Vite dev server proxy forwards requests to your backend.
 * If you prefer to call the backend directly, change baseURL to the full URL:
 *   baseURL: "https://securityapi-x4rg.onrender.com/api"
 */
const API = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15_000, // 15s timeout
  withCredentials: false,
});

function authHeader(token) {
  // If token provided, return header object; otherwise try to read from localStorage.
  const t = token ?? localStorage.getItem("bank_token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

function formatAxiosError(err) {
  if (err.response) {
    // Server responded with a status outside 2xx
    const status = err.response.status;
    const data = err.response.data || {};
    const message =
      data.message ||
      data.error ||
      (typeof data === "string" ? data : `Request failed with status ${status}`);
    return new Error(message);
  } else if (err.request) {
    // Request made but no response
    return new Error("No response from server. Check network / server status.");
  } else {
    // Something else
    return new Error(err.message || "Request error");
  }
}

/* ===== Public API functions ===== */

export async function registerCustomer(payload) {
  // POST /api/register
  try {
    const res = await API.post("/register", payload);
    return res.data;
  } catch (err) {
    throw formatAxiosError(err);
  }
}

export async function loginCustomer(payload) {
  // POST /api/login
  try {
    const res = await API.post("/login", payload);
    return res.data;
  } catch (err) {
    throw formatAxiosError(err);
  }
}

export async function submitPayment(payload, token) {
  // POST /api/payments
  try {
    const res = await API.post("/payments", payload, {
      headers: { ...authHeader(token) },
    });
    return res.data;
  } catch (err) {
    throw formatAxiosError(err);
  }
}

export async function fetchMyPayments(token) {
  // GET /api/payments (customer-specific)
  try {
    const res = await API.get("/payments", {
      headers: { ...authHeader(token) },
    });
    return res.data;
  } catch (err) {
    throw formatAxiosError(err);
  }
}

/* Optional: export raw axios instance if you need advanced usage elsewhere */
export { API };
