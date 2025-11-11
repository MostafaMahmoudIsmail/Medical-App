import { useEffect, useState } from "react";
import api from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("users");
  const [specialties, setSpecialties] = useState([]);
  const [newSpecialty, setNewSpecialty] = useState({ name: "", description: "" });


  // 🔹 تحميل البيانات
  useEffect(() => {
    fetchUsers();
    fetchAppointments();
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

  async function fetchSpecialties() {
  try {
    const res = await api.get("profiles/admin/specialties/");
    setSpecialties(res.data);
  } catch (err) {
    toast.error("❌ Failed to load specialties");
  }
    }


  async function deleteUser(id) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`profiles/admin/users/${id}/`);
      toast.info("🗑️ User deleted");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to delete user");
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        Loading admin data...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <ToastContainer position="top-right" autoClose={2000} />
      <h1 className="text-3xl font-bold text-blue-700 text-center mb-8">
        🛠️ Admin Dashboard
      </h1>

   
        <div className="flex justify-center mb-6 gap-4">
        <button
            onClick={() => setTab("users")}
            className={`px-4 py-2 rounded-lg ${
            tab === "users" ? "bg-blue-600 text-white" : "bg-white border"
            }`}
        >
            👥 Manage Users
        </button>
        <button
            onClick={() => setTab("appointments")}
            className={`px-4 py-2 rounded-lg ${
            tab === "appointments" ? "bg-blue-600 text-white" : "bg-white border"
            }`}
        >
            📅 Appointments
        </button>
        <button
            onClick={() => setTab("specialties")}
            className={`px-4 py-2 rounded-lg ${
            tab === "specialties" ? "bg-blue-600 text-white" : "bg-white border"
            }`}
        >
            🩺 Specialties
        </button>
        </div>


   
      {tab === "users" && (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">All Users</h2>
          {users.length === 0 ? (
            <p className="text-gray-500">No users found.</p>
          ) : (
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">Username</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Role</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="text-center border-t">
                    <td className="p-2">{u.id}</td>
                    <td className="p-2">{u.username}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.role}</td>
                    <td className="p-2">
                      {u.is_active ? (
                        <span className="text-green-600 font-semibold">
                          Active
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          Blocked
                        </span>
                      )}
                    </td>
                    <td className="p-2 flex justify-center gap-2">
                      <button
                        onClick={() => toggleUserActive(u.id, u.is_active)}
                        className={`px-3 py-1 rounded text-white ${
                          u.is_active
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {u.is_active ? "Block" : "Unblock"}
                      </button>
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

   
      {tab === "appointments" && (
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">All Appointments</h2>
          {appointments.length === 0 ? (
            <p className="text-gray-500">No appointments found.</p>
          ) : (
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">Doctor</th>
                  <th className="p-2 border">Patient</th>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id} className="text-center border-t">
                    <td className="p-2">{a.id}</td>
                    <td className="p-2">{a.doctor_name}</td>
                    <td className="p-2">{a.patient_name}</td>
                    <td className="p-2">{a.date}</td>
                    <td className="p-2">{a.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === "specialties" && (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Manage Specialties</h2>

          
            <form
            onSubmit={async (e) => {
                e.preventDefault();
                if (!newSpecialty.name.trim()) {
                toast.warning("⚠️ Please enter a name");
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
            }}
            className="flex flex-col sm:flex-row gap-3 mb-6"
            >
            <input
                type="text"
                placeholder="Specialty name"
                value={newSpecialty.name}
                onChange={(e) =>
                setNewSpecialty({ ...newSpecialty, name: e.target.value })
                }
                className="border p-2 rounded flex-1"
            />
            <input
                type="text"
                placeholder="Description (optional)"
                value={newSpecialty.description}
                onChange={(e) =>
                setNewSpecialty({ ...newSpecialty, description: e.target.value })
                }
                className="border p-2 rounded flex-1"
            />
            <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
                ➕ Add
            </button>
            </form>

        
            {specialties.length === 0 ? (
            <p className="text-gray-500">No specialties found.</p>
            ) : (
            <ul>
                {specialties.map((s) => (
                <li
                    key={s.id}
                    className="flex justify-between items-center border-b py-2"
                >
                    <span>
                    <strong>{s.name}</strong>{" "}
                    {s.description && <span className="text-gray-500">- {s.description}</span>}
                    </span>
                    <button
                    onClick={async () => {
                        if (!window.confirm("Delete this specialty?")) return;
                        try {
                        await api.delete(`profiles/admin/specialties/${s.id}/`);
                        toast.info("🗑️ Deleted");
                        fetchSpecialties();
                        } catch (err) {
                        toast.error("❌ Failed to delete");
                        }
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                    Delete
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
