import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router";
import ApiClient from "../../utils/ApiClient";
import { type Progress } from "../../models/postModel.ts";

function ProgressPage() {
  const [progress, setProgress] = useState<Progress[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  const fetchProgress = useCallback(async () => {
    const response = await ApiClient.get("/progress");
    if (response.status === 200) {
      setProgress(response.data.data || []);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const handleLike = async (id: string) => {
    await ApiClient.post(`/progress/${id}/like`);
    fetchProgress();
  };

  return (
    <div className={`container py-4 ${darkMode ? "dark-mode" : ""}`}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-gradient">✨ FITSNAP</h2>
        <div className="d-flex gap-3 align-items-center">
          <i className="bi bi-bell-fill fs-5 text-primary"></i>
          <i className="bi bi-person-circle fs-5 text-secondary"></i>
          <button
            className="btn btn-sm btn-pill btn-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
          <NavLink to="/add-progress" className="btn btn-dark btn-pill">
            ➕ Add
          </NavLink>
        </div>
      </div>

      {/* Grid Gallery */}
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {progress.map((item) => (
          <div key={item._id} className="col">
            <div className="card h-100 shadow-sm border-0 modern-card">
              {/* Image */}
              {item.imageUrl && (
                <div className="position-relative">
                  <img
                    src={`http://localhost:3000/${item.imageUrl}`}
                    alt="progress"
                    className="card-img-top rounded"
                    style={{ objectFit: "cover", height: "220px" }}
                  />
                  <div className="overlay d-flex justify-content-center align-items-center">
                    <span>{item.description}</span>
                  </div>
                </div>
              )}

              {/* Body */}
              <div className="card-body">
                <h6 className="fw-semibold mb-1">@{item.userId.username}</h6>
                <p className="text-muted small mb-2">
                  {new Date(item.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>

                {/* Actions */}
                <div className="d-flex justify-content-between align-items-center">
                  <button
                    className="btn btn-sm btn-outline-danger btn-pill btn-like"
                    onClick={() => handleLike(item._id)}
                  >
                    ❤️ {item.likes}
                  </button>
                  <NavLink
                    to={`/comment/${item._id}`}
                    className="btn btn-sm btn-outline-info btn-pill"
                  >
                    💬 Comment
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProgressPage;