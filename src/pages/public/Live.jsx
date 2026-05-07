import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllContent } from "../../services/content.service";
import { useAuth } from "../../context/AuthContext";

export default function Live() {
  const { teacherId } = useParams();

  const navigate = useNavigate();

  const { logout } = useAuth();

  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [teacherId]);

  const fetchData = async () => {
    try {
      const res = await getAllContent();

      const now = new Date();

      const activeSlides = res.data.filter((item) => {
        const start = new Date(item.startTime);
        const end = new Date(item.endTime);

        return (
          String(item.teacherId) === teacherId &&
          item.status === "approved" &&
          now >= start &&
          now <= end
        );
      });

      setSlides(activeSlides);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Rotation
  useEffect(() => {
    if (!slides.length) return;

    const duration =
      (slides[currentIndex]?.rotationDuration || 3) * 1000;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }, duration);

    return () => clearInterval(interval);

  }, [slides, currentIndex]);

  // ✅ Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  if (!slides.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No content available</p>
      </div>
    );
  }

  const current = slides[currentIndex];

  return (
    <div className="min-h-screen bg-black text-white relative">

      {/* ✅ Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-5 right-5 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
      >
        Logout
      </button>

      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">

          <h1 className="text-3xl mb-4">
            Live Broadcast
          </h1>

          <h2 className="text-xl">
            {current.title}
          </h2>

          <p className="mb-3">
            {current.subject}
          </p>

          <img
            src={current.fileUrl}
            alt={current.title}
            className="w-175 h-80 object-cover rounded mx-auto"
          />

          <p className="mt-4 text-sm">
            Slide {currentIndex + 1} of {slides.length}
          </p>

        </div>
      </div>
    </div>
  );
}