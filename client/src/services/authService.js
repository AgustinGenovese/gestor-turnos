import { API_URL } from "../api/fetch"; // <-- importamos la URL del backend

export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include"
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Error en login");
  }

  return res.json();
};

export const logout = async () => {
  await fetch(`${API_URL}/api/auth/logout`, { method: "POST", credentials: "include" });
};

export const checkSesion = async () => {
  const res = await fetch(`${API_URL}/api/auth/check`, { credentials: "include" });
  return res.json();
};
