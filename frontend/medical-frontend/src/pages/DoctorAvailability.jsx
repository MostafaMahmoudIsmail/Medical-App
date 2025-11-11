import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { ToastContainer, toast } from "react-toastify"; // ✅ استيراد المكتبة
import "react-toastify/dist/ReactToastify.css"; // ✅ استيراد الـ CSS الخاص بها

export default function DoctorAvailability() {
  const [availabilities, setAvailabilities] = useState([]);
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAvailability();
  }, []);

  async function fetchAvailability() {
    try {
      const res = await api.get("appointments/availability/");
      setAvailabilities(res.data);
    } catch (err) {
      console.error("Error loading availability:", err);
      toast.error("❌ Failed to load availability.");
    }
  }

  async function addAvailability(e) {
    e.preventDefault();
    if (!day || !startTime || !endTime) {
      toast.warning("⚠️ Please fill in all fields.");
      return;
    }

    try {
      await api.post("appointments/availability/", {
        day,
        start_time: startTime,
        end_time: endTime,
      });
      toast.success("✅ Availability added successfully!");
      setDay("");
      setStartTime("");
      setEndTime("");
      fetchAvailability();
    } catch (err) {
      console.error("Error adding availability:", err.response?.data || err);
      toast.error("❌ Failed to add availability.");
    }
  }

  async function deleteAvailability(id) {
    try {
      await api.delete(`appointments/availability/${id}/`);
      toast.info("🗑️ Availability deleted.");
      fetchAvailability();
    } catch (err) {
      console.error("Error deleting availability:", err.response?.data || err);
      toast.error("❌ Failed to delete availability.");
    }
  }

  return (
    <div className="min-h-screen bg-green-50 p-10">
      <ToastContainer position="top-right" autoClose={2500} />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-700">
          🩺 Doctor Availability
        </h1>

        <button
          onClick={() => navigate("/doctor-dashboard")}
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
        >
          🔙 Back to Dashboard
        </button>
      </div>

    
      <form
        onSubmit={addAvailability}
        className="max-w-lg mx-auto bg-white shadow-md rounded-xl p-6 border border-gray-200 mb-10"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Add New Availability
        </h2>

        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Day</label>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">Select Day</option>
              <option value="MON">Monday</option>
              <option value="TUE">Tuesday</option>
              <option value="WED">Wednesday</option>
              <option value="THU">Thursday</option>
              <option value="FRI">Friday</option>
              <option value="SAT">Saturday</option>
              <option value="SUN">Sunday</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Add Availability
          </button>
        </div>
      </form>

 
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Your Current Availability
        </h2>

        {availabilities.length === 0 ? (
          <p className="text-gray-500">No availability added yet.</p>
        ) : (
          availabilities.map((slot) => (
            <div
              key={slot.id}
              className="flex justify-between items-center p-3 mb-2 bg-green-50 rounded-md"
            >
              <span>
                {slot.day}: {slot.start_time} — {slot.end_time}
              </span>
              <button
                onClick={() => deleteAvailability(slot.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
