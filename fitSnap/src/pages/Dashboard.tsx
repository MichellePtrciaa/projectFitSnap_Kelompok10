import { useCallback, useEffect, useState } from "react";
import ApiClient from "../utils/ApiClient";
import { Button } from "react-bootstrap";
import { FaHeart, FaUserCircle } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import Masonry from "react-masonry-css";

/* ================= TYPE ================= */
type Post = {
  _id: string;
  caption: string;
  imageUrl: string;
  userId: {
    _id: string;
    username: string;
  };
  createdAt: string;
  likes?: string[];
};

/* ================= IMAGE HELPER ================= */
const getImageUrl = (path: string) => {
  return `http://localhost:3000/${path}`;
};

function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const navigate = useNavigate();

  /* ================= FETCH POSTS ================= */
  const fetchPosts = useCallback(async () => {
    try {
      const res = await ApiClient.get("/post");
      setPosts(res.data.data || []);
    } catch (error) {
      console.error("Gagal fetch posts:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  /* ================= LIKE (LOCAL) ================= */
  const handleLike = (postId: string) => {
    setLikedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  /* ================= VIEW PROGRESS ================= */
  const handleViewProgress = (postId: string, userId: string) => {
    navigate(`/progress/${postId}?user=${userId}`);
  };

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <div className={`container py-4 ${darkMode ? "dark-mode" : ""}`}>
      {/* ===== HEADER ===== */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">✨ FITSNAP</h2>

        <div className="d-flex gap-2 align-items-center">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>

          <NavLink to="/postModel" className="btn btn-outline-primary">
            Post
          </NavLink>

          <NavLink to="/progress" className="btn btn-outline-primary">
            My Progress
          </NavLink>

          <Button
            variant="primary"
            size="sm"
            className="d-flex align-items-center gap-1"
            onClick={() => navigate("/profile")}
          >
            <FaUserCircle size={18} /> Profile
          </Button>
        </div>
      </div>

      {/* ===== BODY ===== */}
      {loading ? (
        <p className="text-center text-muted">Loading...</p>
      ) : posts.length === 0 ? (
        <div className="text-center text-muted">
          <p>Belum ada postingan.</p>
        </div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {posts.map((post) => (
            <div
              key={post._id}
              className="card border-0 shadow-sm mb-3"
            >
              <img
                src={getImageUrl(post.imageUrl)}
                alt="post"
                className="card-img-top"
                style={{ objectFit: "cover", maxHeight: 400, cursor: "pointer" }}
                onClick={() =>
                  handleViewProgress(post._id, post.userId._id)
                }
              />

              <div className="card-body">
                <strong>@{post.userId.username}</strong>

                <div className="text-muted small mb-2">
                  {new Date(post.createdAt).toLocaleDateString("id-ID")}
                </div>

                <p>{post.caption}</p>

                <Button
                  variant="link"
                  className={`p-0 ${
                    likedPosts.includes(post._id)
                      ? "text-danger"
                      : "text-muted"
                  }`}
                  onClick={() => handleLike(post._id)}
                >
                  <FaHeart />{" "}
                  {post.likes
                    ? post.likes.length +
                      (likedPosts.includes(post._id) ? 1 : 0)
                    : likedPosts.includes(post._id)
                    ? 1
                    : 0}
                </Button>
              </div>
            </div>
          ))}
        </Masonry>
      )}
    </div>
  );
}

export default Dashboard;
