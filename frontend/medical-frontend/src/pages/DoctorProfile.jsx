import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUserMd, FaSave, FaArrowLeft } from "react-icons/fa";

export default function DoctorProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-10">
      <ToastContainer position="top-right" autoClose={2500} />

      <div className="flex items-center justify-center gap-3 mb-8">
        <FaUserMd className="text-3xl text-green-600" />
        <h1 className="text-3xl font-bold text-green-700 text-center">
          Edit Doctor Profile
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-200"
      >
        <div className="grid gap-5">
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Specialty
            </label>
            <input
              type="text"
              value={profile.specialty || ""}
              onChange={(e) =>
                setProfile({ ...profile, specialty: e.target.value })
              }
              className="border rounded-lg w-full p-3 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">Bio</label>
            <textarea
              value={profile.bio || ""}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="border rounded-lg w-full p-3 focus:ring-2 focus:ring-green-400 outline-none"
              rows="3"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Phone
            </label>
            <input
              type="text"
              value={profile.phone || ""}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              className="border rounded-lg w-full p-3 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Years of Experience
            </label>
            <input
              type="number"
              value={profile.years_of_experience || 0}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  years_of_experience: e.target.value,
                })
              }
              className="border rounded-lg w-full p-3 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Clinic Address
            </label>
            <input
              type="text"
              value={profile.clinic_address || ""}
              onChange={(e) =>
                setProfile({ ...profile, clinic_address: e.target.value })
              }
              className="border rounded-lg w-full p-3 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-300 text-gray-800 py-2 px-5 rounded-lg flex items-center gap-2 hover:bg-gray-400 transition"
            >
              <FaArrowLeft /> Back
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-5 rounded-lg flex items-center gap-2 hover:bg-green-700 transition"
            >
              <FaSave /> Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
