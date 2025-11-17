import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Calendar, Users, LogOut, Menu, X, Wrench, DollarSign } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { handleLogout } = useAuth();

  const menuItems = [
    { name: "Calendario", path: "/CalendarAdmin", icon: <Calendar size={20} /> },
    { name: "Clientes", path: "/ClientesAdmin", icon: <Users size={20} /> },
    { name: "Tipos de Turnos", path: "/TiposTurnosAdmin", icon: <Wrench size={20} /> },
    { name: "Cobros", path: "/CobrosAdmin", icon: <DollarSign size={20} /> },

  ];

  const logoutAndRedirect = async () => {
    await handleLogout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`flex flex-col transition-all duration-300 
                    ${sidebarOpen ? "w-64" : "w-16"} bg-gray-800 shadow-md`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <span className={`${sidebarOpen ? "block" : "hidden"} font-bold text-lg text-gray-100`}>
            Menu
          </span>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={20} className="text-gray-100" /> : <Menu size={20} className="text-gray-100" />}
          </button>
        </div>

        {/* Navegación */}
        <nav className="mt-4 flex-1 flex flex-col">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-2 rounded transition
                ${location.pathname === item.path
                  ? "bg-gray-700 font-semibold text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
            >
              {item.icon}
              <span className={`${sidebarOpen ? "block" : "hidden"}`}>{item.name}</span>
            </Link>
          ))}

          {/* Botón de Cerrar sesión al final */}
          <button
            onClick={logoutAndRedirect}
            className={`flex items-center gap-2 px-4 py-2 mt-auto mb-4 w-full text-left rounded transition
              text-red-400 hover:bg-red-600 hover:text-white ${sidebarOpen ? "block" : "hidden"}`}
          >
            <LogOut size={20} />
            Cerrar sesión
          </button>
        </nav>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 overflow-auto p-6">
        <Outlet />
      </div>
    </div>
  );
}
