import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthResponse, User } from "../types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (auth: AuthResponse) => void;
  logout: () => void;
  isAdmin: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const parseStoredUser = (storedUser: string | null): User | null => {
  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setUser(parseStoredUser(localStorage.getItem("user")));
  }, []);

  const login = (auth: AuthResponse): void => {
    localStorage.setItem("token", auth.token);
    localStorage.setItem("user", JSON.stringify(auth.user));
    setToken(auth.token);
    setUser(auth.user);
  };

  const logout = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      login,
      logout,
      isAdmin: user?.role === "admin",
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
