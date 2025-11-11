import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCalendarCheck, FaUserMd } from "react-icons/fa";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function fetchAppointments() {
    try {
      const res = await api.get("appointments/appointments/");
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
      setError("❌ Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, newStatus) {
    try {
      await api.patch(`appointments/appointments/${id}/`, { status: newStatus });
      toast.success(`✅ Appointment ${newStatus.toLowerCase()} successfully.`);
      fetchAppointments();
    } catch (err) {
      console.error("Status update error:", err.response?.data || err);
      toast.error("❌ Failed to update appointment.");
    }
  }

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        Loading appointments...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-10">
      <ToastContainer position="top-right" autoClose={2500} />

      <div className="flex items-center justify-center gap-3 mb-8">
        <FaUserMd className="text-3xl text-green-600" />
        <h1 className="text-3xl font-bold text-green-700 text-center">
          Doctor Dashboard
        </h1>
      </div>

      <div className="flex justify-center flex-wrap gap-4 mb-8">
        <button
          onClick={() => navigate("/home")}
          className="bg-blue-500 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-600 transition"
        >
           Home
        </button>
        <button
          onClick={() => navigate("/doctor-availability")}
          className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition"
        >
           Manage Availability
        </button>
        <button
          onClick={() => navigate("/doctor-profile")}
          className="bg-yellow-500 text-white px-5 py-2 rounded-lg shadow hover:bg-yellow-600 transition"
        >
           Edit Profile
        </button>
      </div>

      {appointments.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No appointments found.
        </p>
      ) : (
        <div className="grid gap-4 max-w-4xl mx-auto">
          {appointments.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-xl p-5 shadow-md border-l-4 transition hover:shadow-lg"
              style={{
                borderColor:
                  app.status === "CONFIRMED"
                    ? "#22c55e"
                    : app.status === "CANCELLED"
                    ? "#ef4444"
                    : app.status === "COMPLETED"
                    ? "#3b82f6"
                    : "#9ca3af",
              }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">
                    Patient:{" "}
                    <span className="text-gray-700">{app.patient_name}</span>
                  </p>
                  <p className="text-gray-600">
                    Date: <strong>{app.date}</strong>
                  </p>
                  <p className="text-gray-600">
                    Status:{" "}
                    <span
                      className={`font-semibold ${
                        app.status === "CONFIRMED"
                          ? "text-green-600"
                          : app.status === "CANCELLED"
                          ? "text-red-600"
                          : app.status === "COMPLETED"
                          ? "text-blue-600"
                          : "text-gray-600"
                      }`}
                    >
                      {app.status}
                    </span>
                  </p>
                </div>

                <div className="flex gap-2">
                  {app.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => updateStatus(app.id, "CONFIRMED")}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateStatus(app.id, "CANCELLED")}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {app.status === "CONFIRMED" && (
                    <button
                      onClick={() => updateStatus(app.id, "COMPLETED")}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
