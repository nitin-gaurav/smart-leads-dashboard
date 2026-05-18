// Authentication state and role context.
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { MESSAGES } from "../constants/messages";
import { AuthResponse, User } from "../types";

interface IAuthContextValue {
  user: User | null;
  token: string | null;
  login: (auth: AuthResponse) => void;
  logout: () => void;
  isAdmin: boolean;
}

interface IAuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<IAuthContextValue | undefined>(undefined);

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

export const AuthProvider = ({ children }: IAuthProviderProps) => {
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

  const value = useMemo<IAuthContextValue>(
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

export const useAuth = (): IAuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(MESSAGES.AUTH_CONTEXT_MISSING);
  }

  return context;
};
