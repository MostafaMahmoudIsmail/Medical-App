import { useEffect, useState } from "react";
import api from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";

export default function PatientProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await api.get("profiles/patient/profile/");
      setProfile(res.data);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.patch("profiles/patient/profile/", profile);
      toast.success("✅ Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update profile");
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        Loading profile...
      </div>
    );

  if (!profile)
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        Profile not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-10">
      <ToastContainer position="top-right" autoClose={2500} />
      <div className="flex items-center justify-center gap-3 mb-8">
        <FaUserEdit className="text-3xl text-blue-600" />
        <h1 className="text-3xl font-bold text-blue-700 text-center">
          Edit Patient Profile
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-200"
      >
        <div className="grid gap-5">
          <div>
            <label className="block font-medium mb-1 text-gray-700">Phone</label>
            <input
              type="text"
              value={profile.phone || ""}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              className="border rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">Age</label>
            <input
              type="number"
              value={profile.age || ""}
              onChange={(e) =>
                setProfile({ ...profile, age: e.target.value })
              }
              className="border rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">Gender</label>
            <select
              value={profile.gender || ""}
              onChange={(e) =>
                setProfile({ ...profile, gender: e.target.value })
              }
              className="border rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">Address</label>
            <input
              type="text"
              value={profile.address || ""}
              onChange={(e) =>
                setProfile({ ...profile, address: e.target.value })
              }
              className="border rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div className="flex gap-4 justify-between mt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-300 text-gray-800 py-2 px-5 rounded-lg hover:bg-gray-400 transition"
            >
              ← Back
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-5 rounded-lg hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
