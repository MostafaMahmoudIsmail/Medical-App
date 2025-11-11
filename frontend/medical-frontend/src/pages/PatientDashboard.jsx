import { useEffect, useState } from "react";
import api from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { FaUserMd, FaClipboardList, FaCalendarAlt } from "react-icons/fa";

export default function PatientDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availabilities, setAvailabilities] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

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

  async function bookAppointment(slot) {
    if (!selectedDate) {
      toast.warning("Please choose a date before booking.");
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

  async function cancelAppointment(id) {
    try {
      await api.patch(`appointments/appointments/${id}/`, {
        status: "CANCELLED",
      });
      toast.info("Appointment cancelled successfully.");
      fetchAppointments();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to cancel appointment.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-10">
      <ToastContainer position="top-right" autoClose={2500} />

      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FaClipboardList className="text-3xl text-blue-600" />
          <h1 className="text-3xl font-bold text-blue-700">Patient Dashboard</h1>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate("/home")}
            className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 shadow transition"
          >
             Home
          </button>
          <button
            onClick={() => navigate("/patient-profile")}
            className="bg-yellow-500 text-white px-5 py-2 rounded-lg hover:bg-yellow-600 shadow transition"
          >
             Edit Profile
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2">
      
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
            <FaUserMd className="text-blue-500" /> Available Doctors
          </h2>
          {doctors.length === 0 ? (
            <p className="text-gray-500">No doctors found.</p>
          ) : (
            <div className="space-y-2">
              {doctors.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => fetchAvailability(doc.profile_id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedDoctor === doc.profile_id
                      ? "bg-blue-100 border-blue-400"
                      : "hover:bg-blue-50"
                  }`}
                >
                  Dr. {doc.username}
                </button>
              ))}
            </div>
          )}
        </div>

       
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
            <FaCalendarAlt className="text-blue-500" /> Doctor Availability
          </h2>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full mb-4 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />

          {availabilities.length === 0 ? (
            <p className="text-gray-500">
              Select a doctor to view available times.
            </p>
          ) : (
            <div className="space-y-2">
              {availabilities.map((slot) => (
                <div
                  key={slot.id}
                  className="flex justify-between items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                >
                  <span className="text-gray-700">
                    {slot.day}: {slot.start_time} – {slot.end_time}
                  </span>
                  <button
                    onClick={() => bookAppointment(slot)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                  >
                    Book
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

     
      <div className="max-w-4xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          My Appointments
        </h2>

        {appointments.length === 0 ? (
          <p className="text-gray-500 text-center">
            You have no appointments yet.
          </p>
        ) : (
          <div className="space-y-2">
            {appointments.map((a) => (
              <div
                key={a.id}
                className={`flex justify-between items-center p-3 rounded-lg transition ${
                  a.status === "CONFIRMED"
                    ? "bg-green-50"
                    : a.status === "CANCELLED"
                    ? "bg-red-50"
                    : "bg-gray-50"
                }`}
              >
                <span className="text-gray-700">
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
