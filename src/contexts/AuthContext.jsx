import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Adiciona estado de carregamento

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser); // Salva as informações do usuário no contexto
      } catch (error) {
        console.error("Token inválido:", error);
        localStorage.removeItem("token"); // Remove token inválido
        setUser(null);
      }
    }
    setIsLoading(false); // Carregamento concluído
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("token", userData.access_token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const value = { user, login, logout, isLoading }; // Inclui isLoading

  if (isLoading) {
    return <div>Carregando...</div>; // Ou um componente de loading adequado
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
