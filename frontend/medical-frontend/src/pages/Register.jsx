import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "PATIENT",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Registration failed");
      const data = await res.json();
      setMessage(`${data.username} registered successfully!`);
      setFormData({ username: "", email: "", password: "", role: "PATIENT" });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl p-10 w-[90%] sm:w-[400px] text-gray-800"
      >
        <div className="flex flex-col items-center mb-6">
          <FaUserPlus className="text-4xl text-indigo-600 mb-2" />
          <h2 className="text-2xl font-bold text-center text-indigo-700">
            Create Account
          </h2>
          <p className="text-sm text-gray-500">Join the Medical Portal</p>
        </div>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg w-full p-3 mb-3 focus:ring-2 focus:ring-indigo-400 outline-none"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg w-full p-3 mb-3 focus:ring-2 focus:ring-indigo-400 outline-none"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg w-full p-3 mb-3 focus:ring-2 focus:ring-indigo-400 outline-none"
          required
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg w-full p-3 mb-4 focus:ring-2 focus:ring-indigo-400 outline-none"
        >
          <option value="PATIENT">Patient</option>
          <option value="DOCTOR">Doctor</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold rounded-lg w-full p-3"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {message && (
          <p className="text-center mt-4 text-sm font-medium text-gray-700">
            {message}
          </p>
        )}

        <div className="text-center mt-5 text-sm text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-indigo-600 font-semibold cursor-pointer hover:underline"
          >
            Login here
          </span>
        </div>
      </form>
    </div>
  );
}
