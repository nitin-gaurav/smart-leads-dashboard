// Centralized frontend messages.
export const MESSAGES = {
  AUTH_CONTEXT_MISSING: "useAuth must be used within an AuthProvider",
  CREATE_LEAD_FAILED: "Could not create lead",
  DELETE_LEAD_CONFIRM: "Delete this lead?",
  EMAIL_REQUIRED: "Email is required",
  EMAIL_PASSWORD_REQUIRED: "Email and password are required",
  EXPORT_FAILED: "Could not export CSV",
  INVALID_EMAIL: "Enter a valid email address",
  LEADS_LOAD_FAILED: "Could not load leads",
  LOGIN_FAILED: "Login failed",
  NAME_EMAIL_PASSWORD_REQUIRED: "Name, email, and password are required",
  NAME_REQUIRED: "Name is required",
  NO_LEAD_SELECTED: "No lead selected",
  PASSWORD_MIN_LENGTH: "Password must be at least 6 characters",
  REGISTER_FAILED: "Registration failed",
  ROOT_ELEMENT_MISSING: "Root element not found",
  UPDATE_LEAD_FAILED: "Could not update lead",
} as const;
