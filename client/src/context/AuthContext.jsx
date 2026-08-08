import { createContext, useContext, useEffect, useState } from "react";

const AUTH_TOKEN_KEY = "authToken";
const AUTH_USER_KEY = "authUser";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedUser = localStorage.getItem(AUTH_USER_KEY);
    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(AUTH_USER_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken, userData) => {
    localStorage.setItem(AUTH_TOKEN_KEY, newToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const signup = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    isLoading,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
