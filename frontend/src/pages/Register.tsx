import axios from "axios";
import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { AuthShell } from "../components/AuthShell";
import { useAuth } from "../context/AuthContext";
import { ApiError, AuthResponse, User } from "../types";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

interface ApiUser extends Omit<User, "id"> {
  id?: string;
  _id?: string;
}

interface ApiAuthResponse extends Omit<AuthResponse, "user"> {
  user: ApiUser;
}

const normalizeAuthResponse = (response: ApiAuthResponse): AuthResponse => ({
  token: response.token,
  user: {
    id: response.user.id ?? response.user._id ?? "",
    name: response.user.name,
    email: response.user.email,
    role: response.user.role,
  },
});

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<ApiError>(error)) {
    return error.response?.data.message ?? "Registration failed";
  }

  return "Registration failed";
};

export const Register = () => {
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
  });
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

    if (!form.name || !form.email || !form.password) {
      setError("Name, email, and password are required");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post<ApiAuthResponse>("/api/auth/register", form);
      login(normalizeAuthResponse(response.data));
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      mode="register"
      title="Create your workspace"
      subtitle="Set up your account and start organizing leads in one focused place."
    >
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {error ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Jane Doe"
              className="w-full border-0 border-b border-slate-200 bg-transparent px-0 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-slate-500 focus:ring-0"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
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
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="At least 6 characters"
              className="w-full border-0 border-b border-slate-200 bg-transparent px-0 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-slate-500 focus:ring-0"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="mx-auto !mt-8 block w-44 rounded-full bg-[#666666] px-4 py-3 text-sm font-semibold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-[#565656] hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>
    </AuthShell>
  );
};
