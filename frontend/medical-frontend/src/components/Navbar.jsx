import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <nav className="bg-blue-600 text-white py-3 px-6 flex justify-between items-center shadow">
     <h1
        onClick={() =>
            navigate(
            user.role === "DOCTOR"
                ? "/doctor-dashboard"
                : user.role === "PATIENT"
                ? "/patient-dashboard"
                : "/admin-dashboard"
            )
        }
        className="font-bold text-lg cursor-pointer hover:text-blue-200 transition"
        >
        🏥 Medical Portal
        </h1>

      <div className="flex items-center gap-4">
        <span className="text-sm">
          Welcome,{" "}
          <strong>
            {user.role === "DOCTOR" ? "Dr. " : ""}
            {user.username}
          </strong>
        </span>

        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
