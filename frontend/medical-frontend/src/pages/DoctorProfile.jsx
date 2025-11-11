import { useEffect, useState } from "react";
import api from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DoctorProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await api.get("profiles/doctor/profile/");
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
      await api.patch("profiles/doctor/profile/", profile);
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
    <div className="min-h-screen bg-green-50 p-10">
      <ToastContainer position="top-right" autoClose={2500} />
      <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
        🩺 Edit Doctor Profile
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-6 border border-gray-200"
      >
        <div className="grid gap-4">
          <div>
            <label className="block font-medium">Specialty</label>
            <input
              type="text"
              value={profile.specialty || ""}
              onChange={(e) => setProfile({ ...profile, specialty: e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block font-medium">Bio</label>
            <textarea
              value={profile.bio || ""}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="border p-2 rounded w-full"
              rows="3"
            />
          </div>

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
            <label className="block font-medium">Years of Experience</label>
            <input
              type="number"
              value={profile.years_of_experience || 0}
              onChange={(e) =>
                setProfile({ ...profile, years_of_experience: e.target.value })
              }
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block font-medium">Clinic Address</label>
            <input
              type="text"
              value={profile.clinic_address || ""}
              onChange={(e) =>
                setProfile({ ...profile, clinic_address: e.target.value })
              }
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
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
