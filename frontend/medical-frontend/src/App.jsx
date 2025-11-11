import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import Home from "./pages/Home"; // ✅ جديد
import Login from "./pages/Login";
import Register from "./pages/Register";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorAvailability from "./pages/DoctorAvailability";
import PatientDashboard from "./pages/PatientDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorProfile from "./pages/DoctorProfile";
import PatientProfile from "./pages/PatientProfile";
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* 🏠 صفحة البداية */}
          <Route path="/home" element={<Home />} />

          {/* صفحات عامة */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* صفحات محمية */}
          <Route
            path="/doctor-dashboard"
            element={
              <ProtectedRoute allowedRoles={["DOCTOR"]}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor-availability"
            element={
              <ProtectedRoute allowedRoles={["DOCTOR"]}>
                <DoctorAvailability />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient-dashboard"
            element={
              <ProtectedRoute allowedRoles={["PATIENT"]}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor-profile"
            element={
              <ProtectedRoute allowedRoles={["DOCTOR"]}>
                <DoctorProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient-profile"
            element={
              <ProtectedRoute allowedRoles={["PATIENT"]}>
                <PatientProfile />
              </ProtectedRoute>
            }
          />


          
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
