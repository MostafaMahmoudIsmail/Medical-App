import { useEffect, useState } from "react";
import api from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
export default function PatientDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availabilities, setAvailabilities] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  // 🧩 تحميل قائمة الأطباء
  useEffect(() => {
    async function fetchDoctors() {
      try {
        const res = await api.get("auth/doctors/");
        setDoctors(res.data);
      } catch (err) {
        console.error(err);
        toast.error("❌ Failed to load doctors.");
      }
    }
    fetchDoctors();
  }, []);

  // 🧩 تحميل المواعيد الحالية
  async function fetchAppointments() {
    try {
      const res = await api.get("appointments/appointments/");
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to load your appointments.");
    }
  }

  useEffect(() => {
    fetchAppointments();
  }, []);

  // 🧩 تحميل المواعيد المتاحة للطبيب
  async function fetchAvailability(doctorProfileId) {
    setSelectedDoctor(doctorProfileId);
    setAvailabilities([]);

    try {
      const res = await api.get(
        `appointments/public-availability/?doctor=${doctorProfileId}`
      );
      setAvailabilities(res.data);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to load availability.");
    }
  }

  // ✅ حجز موعد
  async function bookAppointment(slot) {
    if (!selectedDate) {
      toast.warning("⚠️ Please choose a date before booking.");
      return;
    }

    try {
      await api.post("appointments/appointments/", {
        doctor: slot.doctor,
        availability: slot.id,
        date: selectedDate,
      });
      toast.success("✅ Appointment booked successfully!");
      fetchAppointments();
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error("❌ Failed to book appointment.");
    }
  }

  // ❌ إلغاء موعد
  async function cancelAppointment(id) {
    try {
      await api.patch(`appointments/appointments/${id}/`, {
        status: "CANCELLED",
      });
      toast.info("🗑️ Appointment cancelled successfully.");
      fetchAppointments();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to cancel appointment.");
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 p-10">
      <ToastContainer position="top-right" autoClose={2500} />

      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        👩‍⚕️ Patient Dashboard
      </h1>
      <div className="text-center mb-6">
        <button
            onClick={() => navigate("/home")}
            className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
        >
            🏠 Back to Home
        </button>
        <button
            onClick={() => navigate("/patient-profile")}
            className="bg-yellow-500 text-white px-5 py-2 rounded-lg hover:bg-yellow-600 transition"
            >
            🧾 Edit Profile
            </button>

        </div>


      <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2">
   
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Available Doctors
          </h2>
          {doctors.length === 0 ? (
            <p className="text-gray-500">No doctors found.</p>
          ) : (
            doctors.map((doc) => (
              <button
                key={doc.id}
                onClick={() => fetchAvailability(doc.profile_id)}
                className={`w-full text-left p-3 mb-2 rounded-md border hover:bg-blue-100 ${
                  selectedDoctor === doc.id ? "bg-blue-200" : ""
                }`}
              >
                Dr. {doc.username}
              </button>
            ))
          )}
        </div>

     
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Doctor Availability
          </h2>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />

          {availabilities.length === 0 ? (
            <p className="text-gray-500">
              Select a doctor to view available times.
            </p>
          ) : (
            availabilities.map((slot) => (
              <div
                key={slot.id}
                className="flex justify-between items-center p-3 mb-2 bg-blue-50 rounded-md"
              >
                <span>
                  Day: {slot.day} — {slot.start_time}–{slot.end_time}
                </span>
                <button
                  onClick={() => bookAppointment(slot)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                >
                  Book
                </button>
              </div>
            ))
          )}
        </div>
      </div>

     
      <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          My Appointments
        </h2>

        {appointments.length === 0 ? (
          <p className="text-gray-500 text-center">
            You have no appointments yet.
          </p>
        ) : (
          appointments.map((a) => (
            <div
              key={a.id}
              className={`flex justify-between items-center p-3 mb-2 rounded-md ${
                a.status === "CONFIRMED"
                  ? "bg-green-50"
                  : a.status === "CANCELLED"
                  ? "bg-red-50"
                  : "bg-gray-50"
              }`}
            >
              <span>
                <strong>Doctor:</strong> {a.doctor_name} |{" "}
                <strong>Date:</strong> {a.date} |{" "}
                <strong>Status:</strong>{" "}
                <span
                  className={`font-semibold ${
                    a.status === "CONFIRMED"
                      ? "text-green-600"
                      : a.status === "CANCELLED"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {a.status}
                </span>
              </span>

              {a.status !== "CANCELLED" && (
                <button
                  onClick={() => cancelAppointment(a.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
