import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUserMd } from "react-icons/fa";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const data = await login(username, password);
      console.log(" Role received:", data.role);
      navigate("/home");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid credentials");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl p-10 w-[90%] sm:w-[380px] text-gray-800"
      >
        <div className="flex flex-col items-center mb-6">
          <FaUserMd className="text-4xl text-blue-600 mb-2" />
          <h2 className="text-2xl font-bold text-center text-blue-700">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500">Login to your account</p>
        </div>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-3 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        />

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Login
        </button>

        <div className="text-center mt-5 text-sm text-gray-600">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
          >
            Register here
          </span>
        </div>
      </form>
    </div>
  );
}
