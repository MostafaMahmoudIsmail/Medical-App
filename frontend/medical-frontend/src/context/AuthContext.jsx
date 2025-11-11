import { createContext, useState } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );

async function login(username, password) {
  try {
    console.log("🟢 Sending login request...");
    const { data } = await api.post("auth/login/", { username, password });
    console.log("✅ Login success, response:", data);

    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    localStorage.setItem(
      "user",
      JSON.stringify({ username: data.username, role: data.role })
    );

    setUser({ username: data.username, role: data.role });
    return data;
  } catch (err) {
    console.error("❌ Login failed:", err.response ? err.response.data : err);
    throw err;
  }
}



  function logout() {
    localStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
