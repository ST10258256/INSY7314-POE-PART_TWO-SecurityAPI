// src/utils/validation.js

export const patterns = {
  username: /^[a-zA-Z0-9_]{3,20}$/,
  email: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
  password: /^[A-Za-z\d@$!%*?&]{8,}$/,
  text: /^[a-zA-Z0-9\s.,!?'-]{1,200}$/,
  number: /^\d+$/,
  accountNumber: /^[0-9]{5,15}$/,     // digits only
  idNumber: /^[0-9]{6,13}$/,          // e.g., South African ID range
  fullName: /^[A-Za-z\s'-]{2,50}$/,   // only letters, spaces, hyphens, apostrophes
};

export function validateInput(value, type) {
  const pattern = patterns[type];
  return pattern ? pattern.test(value) : true;
}

export function sanitizeInput(value) {
  return value.replace(/<[^>]*>/g, ""); // remove any HTML tags
}
