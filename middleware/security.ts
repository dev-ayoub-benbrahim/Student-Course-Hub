// Sanitize user input to prevent XSS attacks
// Escapes HTML special characters
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";
  
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// Sanitize an object's string values
export function sanitizeObject(obj: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  
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

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone number (UK format)
export function isValidPhone(phone: string): boolean {
  // Allow UK phone numbers with or without country code
  const phoneRegex = /^(\+44\s?|0)?[1-9]\d{9,10}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ""));
}

// Validate required fields
export function validateRequired(fields: Record<string, any>, required: string[]): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  
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

// Validate string length
export function validateLength(value: string, min: number, max: number): boolean {
  const length = value.trim().length;
  return length >= min && length <= max;
}