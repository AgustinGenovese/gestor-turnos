import { useEffect, useState } from "react";
import { checkSesion, logout } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function PanelAdmin() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verificar = async () => {
      const data = await checkSesion();
      if (!data.autenticado) navigate("/login");
      else setUsuario(data.usuario);
    };
    verificar();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!usuario) return <p>Cargando...</p>;

  return (
    <div>
      <h2>Bienvenido {usuario.nombre}</h2>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}
