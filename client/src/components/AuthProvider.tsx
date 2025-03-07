import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "wouter";

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => void;
  login: (token: string) => void; // Added login function
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  logout: () => { },
  login: () => { } // Added login function
});

export const useAuth = () => useContext(AuthContext);


// Custom hook implementation
const useAuthProvider = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await axios.get("/api/auth/status");
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem("auth_token");
        delete axios.defaults.headers.common["Authorization"];
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const logout = () => {
    localStorage.removeItem("auth_token");
    delete axios.defaults.headers.common["Authorization"];
    setIsAuthenticated(false);
    setLocation("/login");
  };

  const login = (token: string) => {
    localStorage.setItem("auth_token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setIsAuthenticated(true);
    setLocation('/admin'); // Redirect to admin page after successful login
  };

  return { isAuthenticated, loading, logout, login };
};


interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuthProvider();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}