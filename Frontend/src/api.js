// src/api.js
// Axios wrapper for the Banking API.
// In dev (Vite) this defaults to "/api" so the Vite proxy will forward requests to your Render backend.
// In production, set VITE_API_BASE to the real API base URL.

import axios from "axios";
import { getAuth } from "./auth";

const isDev = typeof import.meta !== "undefined" && !!import.meta.env && !!import.meta.env.DEV;
const envBase = typeof import.meta !== "undefined" && !!import.meta.env ? import.meta.env.VITE_API_BASE : undefined;
// When in dev use the dev proxy path '/api'. In production prefer explicit VITE_API_BASE if provided.
const baseURL = isDev ? "/api" : (envBase || "/api");

// axios instance
const api = axios.create({
  baseURL,
  timeout: 10000, // 10s
  headers: {
    "Content-Type": "application/json",
  },
});

// attach Authorization header if token exists
api.interceptors.request.use(
  (cfg) => {
    const auth = getAuth();
    if (auth?.token) {
      cfg.headers = cfg.headers ?? {};
      cfg.headers.Authorization = `Bearer ${auth.token}`;
    }
    return cfg;
  },
  (err) => Promise.reject(err)
);

/**
 * API endpoint helpers matching your Swagger:
 * - POST /api/Auth/register
 * - POST /api/Auth/login
 * - POST /api/Payments
 * - GET  /api/Payments
 *
 * All functions return the axios promise so callers can await or use .then/.catch.
 */

export function registerCustomer(payload) {
  // payload: { firstName, lastName, username, idNumber, accountNumber, email, password }
  return api.post("/Auth/register", payload);
}

export function loginCustomer(payload) {
  // payload: { username, accountNumber, password }
  return api.post("/Auth/login", payload);
}

export function createPayment(payload) {
  // payload: { amount, currency, swiftCode, accountNumber }
  return api.post("/Payments", payload);
}

export function getPayments(config = {}) {
  // config can have { signal } or other axios config entries
  return api.get("/Payments", config);
}

// default export the axios instance if you need to call other endpoints
export default api;
