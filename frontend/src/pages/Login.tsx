// Login page.
import { ChangeEvent, FormEvent, ReactElement, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { AuthShell } from "../components/AuthShell";
import { MESSAGES } from "../constants/messages";
import { useAuth } from "../context/AuthContext";
import { ApiAuthResponse } from "../types";
import { getApiErrorMessage, normalizeAuthResponse } from "../utils/auth";

interface ILoginForm {
  email: string;
  password: string;
}

export const Login = (): ReactElement => {
  const [form, setForm] = useState<ILoginForm>({ email: "", password: "" });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, token } = useAuth();
  const navigate = useNavigate();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError(MESSAGES.EMAIL_PASSWORD_REQUIRED);
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post<ApiAuthResponse>("/api/auth/login", form);
      login(normalizeAuthResponse(response.data));
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, MESSAGES.LOGIN_FAILED));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setForm({ ...form, email: event.currentTarget.value });
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setForm({ ...form, password: event.currentTarget.value });
  };

  return (
    <AuthShell
      mode="login"
      title="Welcome to your workspace"
      subtitle="Sign in with your email to continue managing your sales pipeline."
    >
        <form onSubmit={handleSubmit} className="w-full space-y-5 pt-5">
          {error ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={handleEmailChange}
              placeholder="you@company.com"
              className="w-full border-0 border-b border-slate-200 bg-transparent px-0 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-slate-500 focus:ring-0"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              className="w-full border-0 border-b border-slate-200 bg-transparent px-0 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-slate-500 focus:ring-0"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="mx-auto !mt-10 block w-44 rounded-full bg-[#666666] px-4 py-3 text-sm font-semibold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-[#565656] hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
    </AuthShell>
  );
};
