import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Registration failed");
      }

      const data = await res.json();
      setMessage(`✅ ${data.username} registered successfully!`);
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "PATIENT",
      });
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-2xl p-8 w-[90%] sm:w-[400px]"
      >
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Register
        </h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg w-full p-3 mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg w-full p-3 mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg w-full p-3 mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg w-full p-3 mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
        >
          <option value="PATIENT">Patient</option>
          <option value="DOCTOR">Doctor</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 transition-all text-white font-semibold rounded-lg w-full p-3"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {message && (
          <p className="text-center mt-4 text-sm font-medium text-gray-700">
            {message}
          </p>
        )}
        <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <span
            onClick={() => navigate("/")}
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
            >
            Login here
            </span>
        </p>
        </div>

      </form>
    </div>
  );
}
