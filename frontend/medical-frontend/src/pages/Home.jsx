import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex flex-col justify-center items-center text-white px-6">
      <div className="backdrop-blur-md bg-white/10 rounded-2xl shadow-2xl p-10 text-center max-w-xl">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
           Medical Portal
        </h1>
        <p className="text-lg text-blue-100 mb-8">
          Manage your appointments easily with doctors, patients, and admins.
        </p>

        {user ? (
          <div className="flex flex-wrap justify-center gap-4">
            {user.role === "DOCTOR" && (
              <button
                onClick={() => navigate("/doctor-dashboard")}
                className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-full font-semibold transition"
              >
                Doctor Dashboard
              </button>
            )}
            {user.role === "PATIENT" && (
              <button
                onClick={() => navigate("/patient-dashboard")}
                className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-full font-semibold transition"
              >
                Patient Dashboard
              </button>
            )}
            {user.role === "ADMIN" && (
              <button
                onClick={() => navigate("/admin-dashboard")}
                className="bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded-full font-semibold transition"
              >
                Admin Dashboard
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="bg-white text-blue-700 font-semibold px-6 py-2 rounded-full hover:bg-blue-50 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-full transition"
            >
              Register
            </button>
          </div>
        )}
      </div>

      <footer className="text-sm text-blue-100 mt-10 opacity-80">
        © {new Date().getFullYear()} Medical Portal. All rights reserved.
      </footer>
    </div>
  );
}
