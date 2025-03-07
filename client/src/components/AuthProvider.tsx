
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { useLocation } from "wouter";

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  // Настройка axios для отправки токена с каждым запросом
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [isAuthenticated]);

  // Проверка статуса аутентификации
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
        // Если токен недействителен - удаляем его
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

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
