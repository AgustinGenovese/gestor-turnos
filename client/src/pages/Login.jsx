import { useState } from "react";
import { login, checkSesion } from "../services/authService.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { InputField } from "../components/UI/InputField.jsx";
import { Button } from "../components/UI/Button.jsx";
import { Alert } from "../components/UI/Alert.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setAutenticado, setUsuario } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      const data = await checkSesion();
      console.log(data)

      if (data.autenticado) {
        setAutenticado(true);
        setUsuario(data.usuario);
        navigate("/panelAdmin");
      } else {
        setError("Error al verificar la sesión.");
      }
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-200">
      <div className="w-full max-w-sm bg-gray-50 p-8 rounded-xl shadow-lg border border-gray-300">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Inicio de Sesion</h2>

        {error && <Alert message={error} type="error" />}

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField label="Email" type="text" value={email} onChange={e => setEmail(e.target.value)} required />
          <InputField label="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <Button type="submit">Ingresar</Button>
        </form>
      </div>
    </div>
  );
}
