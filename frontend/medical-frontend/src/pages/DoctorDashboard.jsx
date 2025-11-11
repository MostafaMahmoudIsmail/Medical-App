import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    <div className="min-h-screen bg-green-50 p-10">
      <ToastContainer position="top-right" autoClose={2500} />

      <h1 className="text-3xl font-bold text-green-700 text-center mb-8">
        🩺 Doctor Dashboard
      </h1>


      
        <div className="text-center mb-6 flex justify-center gap-4">
        <button
            onClick={() => navigate("/home")}
            className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
        >
            🏠 Back to Home
        </button>

        <button
            onClick={() => navigate("/doctor-availability")}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
        >
            ➕ Manage Availability
        </button>
        <button
        onClick={() => navigate("/doctor-profile")}
        className="bg-yellow-500 text-white px-5 py-2 rounded-lg hover:bg-yellow-600 transition"
        >
        🧾 Edit Profile
        </button>

        </div>


      {appointments.length === 0 ? (
        <p className="text-center text-gray-500">No appointments found.</p>
      ) : (
        <div className="grid gap-4 max-w-3xl mx-auto">
          {appointments.map((app) => (
            <div
              key={app.id}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center border-l-4"
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
              <div>
                <p>
                  <strong>Patient:</strong> {app.patient_name}
                </p>
                <p>
                  <strong>Date:</strong> {app.date}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
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
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => updateStatus(app.id, "CANCELLED")}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  </>
                )}

                {app.status === "CONFIRMED" && (
                  <button
                    onClick={() => updateStatus(app.id, "COMPLETED")}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
