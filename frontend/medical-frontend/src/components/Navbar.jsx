import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaHospitalUser, FaSignOutAlt } from "react-icons/fa";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-3 shadow-md flex justify-between items-center">
      <div
        onClick={() =>
          navigate(
            user.role === "DOCTOR"
              ? "/doctor-dashboard"
              : user.role === "PATIENT"
              ? "/patient-dashboard"
              : "/admin-dashboard"
          )
        }
        className="flex items-center gap-2 cursor-pointer select-none hover:opacity-90 transition"
      >
        <FaHospitalUser className="text-2xl" />
        <span className="font-semibold text-lg">Medical Portal</span>
      </div>

      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition"
        >
          <span className="text-sm">
            {user.role === "DOCTOR" ? "Dr. " : ""}
            {user.username}
          </span>
          <img
            src={`https://ui-avatars.com/api/?name=${user.username}&background=random`}
            alt="avatar"
            className="w-8 h-8 rounded-full border-2 border-white"
          />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 bg-white text-gray-800 rounded-lg shadow-lg w-40">
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
