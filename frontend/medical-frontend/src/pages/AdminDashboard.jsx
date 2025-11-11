import { useEffect, useState } from "react";
import api from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaUsers,
  FaCalendarAlt,
  FaStethoscope,
  FaUserShield,
  FaTrash,
  FaCheckCircle,
  FaBan,
} from "react-icons/fa";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [newSpecialty, setNewSpecialty] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("users");

  useEffect(() => {
    fetchUsers();
    fetchAppointments();
    fetchSpecialties();
  }, []);

  async function fetchUsers() {
    try {
      const res = await api.get("profiles/admin/users/");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function fetchAppointments() {
    try {
      const res = await api.get("profiles/admin/appointments/");
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to load appointments");
    }
  }

  async function fetchSpecialties() {
    try {
      const res = await api.get("profiles/admin/specialties/");
      setSpecialties(res.data);
    } catch (err) {
      toast.error("❌ Failed to load specialties");
    }
  }

  async function toggleUserActive(id, currentStatus) {
    try {
      await api.patch(`profiles/admin/users/${id}/`, {
        is_active: !currentStatus,
      });
      toast.success("✅ User status updated");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update user status");
    }
  }

  async function deleteUser(id) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`profiles/admin/users/${id}/`);
      toast.info("User deleted");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to delete user");
    }
  }

  async function handleAddSpecialty(e) {
    e.preventDefault();
    if (!newSpecialty.name.trim()) {
      toast.warning("Please enter a name");
      return;
    }
    try {
      await api.post("profiles/admin/specialties/", newSpecialty);
      toast.success("✅ Specialty added");
      setNewSpecialty({ name: "", description: "" });
      fetchSpecialties();
    } catch (err) {
      toast.error("❌ Failed to add specialty");
    }
  }

  async function deleteSpecialty(id) {
    if (!window.confirm("Delete this specialty?")) return;
    try {
      await api.delete(`profiles/admin/specialties/${id}/`);
      toast.info("Deleted");
      fetchSpecialties();
    } catch (err) {
      toast.error("❌ Failed to delete");
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        Loading admin data...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-10">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="flex justify-center items-center gap-3 mb-8">
        <FaUserShield className="text-3xl text-amber-600" />
        <h1 className="text-3xl font-bold text-amber-700 text-center">
          Admin Dashboard
        </h1>
      </div>

   
      <div className="flex justify-center mb-8 gap-4">
        <button
          onClick={() => setTab("users")}
          className={`px-5 py-2 rounded-lg flex items-center gap-2 font-medium ${
            tab === "users"
              ? "bg-amber-600 text-white shadow"
              : "bg-white text-gray-700 border hover:bg-amber-50"
          }`}
        >
          <FaUsers /> Users
        </button>
        <button
          onClick={() => setTab("appointments")}
          className={`px-5 py-2 rounded-lg flex items-center gap-2 font-medium ${
            tab === "appointments"
              ? "bg-amber-600 text-white shadow"
              : "bg-white text-gray-700 border hover:bg-amber-50"
          }`}
        >
          <FaCalendarAlt /> Appointments
        </button>
        <button
          onClick={() => setTab("specialties")}
          className={`px-5 py-2 rounded-lg flex items-center gap-2 font-medium ${
            tab === "specialties"
              ? "bg-amber-600 text-white shadow"
              : "bg-white text-gray-700 border hover:bg-amber-50"
          }`}
        >
          <FaStethoscope /> Specialties
        </button>
      </div>

     
      {tab === "users" && (
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaUsers className="text-amber-600" /> Manage Users
          </h2>

          {users.length === 0 ? (
            <p className="text-gray-500">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-amber-100 text-left">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Username</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr
                      key={u.id}
                      className="border-t hover:bg-amber-50 transition text-center"
                    >
                      <td className="p-3">{u.id}</td>
                      <td className="p-3 font-medium">{u.username}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3">{u.role}</td>
                      <td className="p-3">
                        {u.is_active ? (
                          <span className="text-green-600 font-semibold flex items-center justify-center gap-1">
                            <FaCheckCircle /> Active
                          </span>
                        ) : (
                          <span className="text-red-600 font-semibold flex items-center justify-center gap-1">
                            <FaBan /> Blocked
                          </span>
                        )}
                      </td>
                      <td className="p-3 flex justify-center gap-2">
                        <button
                          onClick={() => toggleUserActive(u.id, u.is_active)}
                          className={`px-3 py-1 rounded text-white text-sm ${
                            u.is_active
                              ? "bg-yellow-500 hover:bg-yellow-600"
                              : "bg-green-500 hover:bg-green-600"
                          }`}
                        >
                          {u.is_active ? "Block" : "Unblock"}
                        </button>
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                        >
                          <FaTrash /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    
      {tab === "appointments" && (
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaCalendarAlt className="text-amber-600" /> All Appointments
          </h2>
          {appointments.length === 0 ? (
            <p className="text-gray-500">No appointments found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-amber-100 text-left">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Doctor</th>
                    <th className="p-3">Patient</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr
                      key={a.id}
                      className="border-t hover:bg-amber-50 text-center transition"
                    >
                      <td className="p-3">{a.id}</td>
                      <td className="p-3">{a.doctor_name}</td>
                      <td className="p-3">{a.patient_name}</td>
                      <td className="p-3">{a.date}</td>
                      <td className="p-3 font-medium text-gray-700">
                        {a.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

   
      {tab === "specialties" && (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaStethoscope className="text-amber-600" /> Manage Specialties
          </h2>

        
          <form
            onSubmit={handleAddSpecialty}
            className="flex flex-col sm:flex-row gap-3 mb-6"
          >
            <input
              type="text"
              placeholder="Specialty name"
              value={newSpecialty.name}
              onChange={(e) =>
                setNewSpecialty({ ...newSpecialty, name: e.target.value })
              }
              className="border p-2 rounded flex-1 focus:ring-2 focus:ring-amber-400 outline-none"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newSpecialty.description}
              onChange={(e) =>
                setNewSpecialty({ ...newSpecialty, description: e.target.value })
              }
              className="border p-2 rounded flex-1 focus:ring-2 focus:ring-amber-400 outline-none"
            />
            <button
              type="submit"
              className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition"
            >
               Add
            </button>
          </form>

      
          {specialties.length === 0 ? (
            <p className="text-gray-500">No specialties found.</p>
          ) : (
            <ul className="divide-y">
              {specialties.map((s) => (
                <li
                  key={s.id}
                  className="flex justify-between items-center py-2 hover:bg-amber-50 transition"
                >
                  <span className="text-gray-800">
                    <strong>{s.name}</strong>{" "}
                    {s.description && (
                      <span className="text-gray-500">
                        – {s.description}
                      </span>
                    )}
                  </span>
                  <button
                    onClick={() => deleteSpecialty(s.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center gap-1"
                  >
                    <FaTrash /> Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
