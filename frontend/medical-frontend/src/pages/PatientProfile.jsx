import { useEffect, useState } from "react";
import api from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PatientProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);


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
    <div className="min-h-screen bg-blue-50 p-10">
      <ToastContainer position="top-right" autoClose={2500} />
      <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">
        👩‍⚕️ Edit Patient Profile
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-6 border border-gray-200"
      >
        <div className="grid gap-4">
          <div>
            <label className="block font-medium">Phone</label>
            <input
              type="text"
              value={profile.phone || ""}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block font-medium">Age</label>
            <input
              type="number"
              value={profile.age || ""}
              onChange={(e) => setProfile({ ...profile, age: e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block font-medium">Gender</label>
            <select
              value={profile.gender || ""}
              onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
              className="border p-2 rounded w-full"
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Address</label>
            <input
              type="text"
              value={profile.address || ""}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>
            <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition"
            >
            ← Back to Dashboard
            </button>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
