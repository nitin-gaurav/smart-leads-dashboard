// Authentication response helpers.
import axios from "axios";
import { MESSAGES } from "../constants/messages";
import { ApiError, ApiAuthResponse, AuthResponse } from "../types";

export const normalizeAuthResponse = (response: ApiAuthResponse): AuthResponse => ({
  token: response.token,
  user: {
    id: response.user.id ?? response.user._id ?? "",
    name: response.user.name,
    email: response.user.email,
    role: response.user.role,
  },
});

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<ApiError>(error)) {
    return error.response?.data.message ?? fallback;
  }

  return fallback || MESSAGES.LOGIN_FAILED;
};
