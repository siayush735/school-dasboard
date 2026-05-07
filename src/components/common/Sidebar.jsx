import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {

  const { user, logout } = useAuth();

  const location = useLocation();

  const navigate = useNavigate();

  if (!user) return null;

  // ✅ Logout Handler
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = (path) =>
    `flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
      location.pathname === path
        ? "bg-blue-600 text-white shadow-lg"
        : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`;

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">

      {/* Top */}
      <div className="flex-1">

        {/* Logo */}
        <div className="p-6 border-b border-gray-800">

          <h2 className="text-2xl font-bold tracking-wide">
            School CMS
          </h2>

          <p className="text-sm text-gray-400 mt-2 capitalize">
            {user.role} Panel
          </p>

        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">

          {/* Teacher */}
          {user.role === "teacher" && (
            <>
              <Link
                to="/teacher/dashboard"
                className={linkClass("/teacher/dashboard")}
              >
                Dashboard
              </Link>

              <Link
                to="/teacher/upload"
                className={linkClass("/teacher/upload")}
              >
                Upload Content
              </Link>

              <Link
                to="/teacher/content"
                className={linkClass("/teacher/content")}
              >
                My Content
              </Link>

              <Link
                to={`/live/${user.id}`}
                className={linkClass(`/live/${user.id}`)}
              >
                Live Screen
              </Link>
            </>
          )}

          {/* Principal */}
          {user.role === "principal" && (
            <>
              <Link
                to="/principal/dashboard"
                className={linkClass("/principal/dashboard")}
              >
                Dashboard
              </Link>

              <Link
                to="/principal/approvals"
                className={linkClass("/principal/approvals")}
              >
                Approvals
              </Link>

              <Link
                to="/principal/all-content"
                className={linkClass("/principal/all-content")}
              >
                All Content
              </Link>
            </>
          )}

        </nav>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800 bg-gray-900">

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 transition-all duration-200 px-4 py-3 rounded-xl font-semibold"
        >
          Logout
        </button>

      </div>

    </aside>
  );
}