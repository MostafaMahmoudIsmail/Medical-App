import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
        🏥 Welcome to Medical Portal
      </h1>
      <p className="text-lg md:text-xl mb-8 text-blue-100">
        Book and manage appointments easily for doctors, patients, and admins.
      </p>

      {user ? (
        <div className="flex gap-4">
          {user.role === "DOCTOR" ? (
            <button
              onClick={() => navigate("/doctor-dashboard")}
              className="bg-green-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Go to Doctor Dashboard
            </button>
          ) : user.role === "PATIENT" ? (
            <button
              onClick={() => navigate("/patient-dashboard")}
              className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Go to Patient Dashboard
            </button>
          ) : user.role === "ADMIN" ? (
            <button
              onClick={() => navigate("/admin-dashboard")}
              className="bg-yellow-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-yellow-600 transition"
            >
              Go to Admin Dashboard
            </button>
          ) : null}
        </div>
      ) : (
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/")}
            className="bg-white text-blue-600 font-semibold px-6 py-2 rounded-lg hover:bg-blue-100 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-800 transition"
          >
            Register
          </button>
        </div>
      )}
    </div>
  );
}
