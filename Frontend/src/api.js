// Simple wrapper functions for server calls - update endpoints as needed
const JSON_HEADERS = { "Content-Type": "application/json" };

export async function registerCustomer(payload) {
  // POST /api/register
  const resp = await fetch("/api/register", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(payload)
  });
  return resp.json();
}

export async function loginCustomer(payload) {
  // POST /api/login -> expects { token, user } in response
  const resp = await fetch("/api/login", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(payload)
  });
  if (!resp.ok) throw new Error("Login failed");
  return resp.json();
}

export async function submitPayment(payload, token) {
  // POST /api/payments
  const resp = await fetch("/api/payments", {
    method: "POST",
    headers: { ...JSON_HEADERS, Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
  return resp.json();
}

export async function fetchMyPayments(token) {
  // GET /api/payments (customer-specific)
  const resp = await fetch("/api/payments", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return resp.json();
}
