import { createContext, useContext, useState, useEffect } from "react";
import { checkSesion, logout } from "../services/authService.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [autenticado, setAutenticado] = useState(null); // null = cargando

  // ✅ Al montar, verificamos si hay sesión activa
  useEffect(() => {
    const verificarSesion = async () => {
      const data = await checkSesion();
      if (data.autenticado) {
        setUsuario(data.usuario);
        setAutenticado(true);
      } else {
        setUsuario(null);
        setAutenticado(false);
      }
    };
    verificarSesion();
  }, []);

  const handleLogout = async () => {
    await logout();
    setUsuario(null);
    setAutenticado(false);
  };

  return (
    <AuthContext.Provider
      value={{ usuario, autenticado, setUsuario, setAutenticado, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
