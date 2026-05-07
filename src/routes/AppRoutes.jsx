import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";

// Teacher
import TeacherDashboard from "../pages/teacher/Dashboard";
import Upload from "../pages/teacher/Upload";
import MyContent from "../pages/teacher/MyContent";

// Principal
import PrincipalDashboard from "../pages/principal/Dashboard";
import Approvals from "../pages/principal/Approvals";
import AllContent from "../pages/principal/AllContent";
import Live from "../pages/teacher/Live";
// Protected
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>

      {/* Default */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />

      {/* ---------------- TEACHER ---------------- */}
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute role="teacher">
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/upload"
        element={
          <ProtectedRoute role="teacher">
            <Upload />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/content"
        element={
          <ProtectedRoute role="teacher">
            <MyContent />
          </ProtectedRoute>
        }
      />

      {/* ---------------- PRINCIPAL ---------------- */}
      <Route
        path="/principal/dashboard"
        element={
          <ProtectedRoute role="principal">
            <PrincipalDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/principal/approvals"
        element={
          <ProtectedRoute role="principal">
            <Approvals />
          </ProtectedRoute>
        }
      />

      <Route
        path="/principal/all-content"
        element={
          <ProtectedRoute role="principal">
            <AllContent />
          </ProtectedRoute>
        }
      />

<Route path="/live/:teacherId" element={<Live />} />

      {/* ---------------- 404 ---------------- */}
      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  );
}