import { useState } from "react";
import { login, checkSesion } from "../services/authService.js";
import { useNavigate } from "react-router-dom";

export default function Login({ setAutenticado }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Hacer login
      await login(email, password);

      // 2. Actualizar estado de sesión
      const data = await checkSesion();
      setAutenticado(data.autenticado);

      // 3. Redirigir al panel
      navigate("/panelAdmin");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-200">
      <div className="w-full max-w-sm bg-gray-50 p-8 rounded-xl shadow-lg border border-gray-300">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Acceso</h2>

        {error && (
          <div className="mb-4 p-2 text-sm text-red-700 bg-red-100 border border-red-300 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario o Email</label>
            <input
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
