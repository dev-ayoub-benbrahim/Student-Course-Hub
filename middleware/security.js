export function sanitizeInput(input) {
  if (typeof input !== "string") return "";

  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

export function sanitizeObject(obj) {
  const sanitized = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone) {
  const phoneRegex = /^(\+44\s?|0)?[1-9]\d{9,10}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ""));
}

export function validateRequired(fields, required) {
  const missing = [];

  for (const field of required) {
    if (!fields[field] || (typeof fields[field] === "string" && fields[field].trim() === "")) {
      missing.push(field);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

export function validateLength(value, min, max) {
  const length = value.trim().length;
  return length >= min && length <= max;
}
