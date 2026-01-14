import { useCallback, useEffect, useState } from "react";
import ApiClient from "../utils/ApiClient";
import CommentSection from "../components/CommentSection";
import { Button } from "react-bootstrap";
import { FaHeart, FaCommentDots, FaUserCircle } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import Masonry from "react-masonry-css";

interface Post {
  _id: string;
  userId: { username: string } | string;
  imageUrl: string;
  caption: string;
  likes: string[];
  commentCount?: number;
  createdAt: string;
}

function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId")!;

  /* ================= FETCH POSTS ================= */
  const fetchPosts = useCallback(async () => {
    try {
      const response = await ApiClient.get("/post?isPosted=true");
      if (response.status === 200) {
        const data = response.data;
        const postData = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];
        setPosts(postData);
      }
    } catch (error) {
      console.error("❌ Gagal fetch posts:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  /* ================= LIKE HANDLER ================= */
  const handleLike = async (postId: string) => {
    try {
      const response = await ApiClient.post(`/post/${postId}/like`);
      const { liked } = response.data;

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: liked
                  ? [...post.likes, currentUserId]
                  : post.likes.filter((id) => id !== currentUserId),
              }
            : post
        )
      );
    } catch (error) {
      console.error("❌ Like gagal:", error);
    }
  };

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  /* ================= RENDER ================= */
  return (
    <div className={`container py-4 ${darkMode ? "dark-mode" : ""}`}>
      {/* ===== Header ===== */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-gradient">✨ FITSNAP</h2>
        <div className="d-flex gap-2 align-items-center">
          <button
            className="btn btn-sm btn-pill btn-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>

          <NavLink to="/signin" className="btn btn-outline-primary">
            Log Out
          </NavLink>

          <NavLink to="/progress" className="btn btn-outline-primary">
            My Progress
          </NavLink>

          <NavLink to="/postModel" className="btn btn-outline-primary">
            Post
          </NavLink>

          <Button
            variant="primary"
            size="sm"
            className="d-flex align-items-center gap-1 rounded-pill px-3"
            onClick={() => navigate("/profile")}
          >
            <FaUserCircle size={18} /> Profile
          </Button>
        </div>
      </div>

      {/* ===== Body ===== */}
      {loading ? (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton skeleton-card"></div>
          ))}
        </Masonry>
      ) : posts.length === 0 ? (
        <div className="text-center text-muted">
          <p>Belum ada postingan yang dibagikan pengguna lain.</p>
        </div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {posts.map((item) => {
            const isLiked = item.likes.includes(currentUserId);

            return (
              <div
                key={item._id}
                className="card border-0 shadow-sm mb-3 modern-card"
              >
                <img
                  src={`http://localhost:3000/${item.imageUrl}`}
                  alt="post"
                  className="card-img-top"
                  style={{ objectFit: "cover", maxHeight: "400px" }}
                />

                <div className="card-body">
                  <strong>
                    @
                    {item.userId && typeof item.userId !== "string"
                      ? item.userId.username
                      : item.userId ?? "unknown"}
                  </strong>

                  <div className="text-muted small mb-2">
                    {new Date(item.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>

                  <p>{item.caption}</p>

                  <div className="d-flex align-items-center gap-3 mb-2">
                    <Button
                      variant="link"
                      className={`p-0 ${
                        isLiked ? "text-danger" : "text-muted"
                      }`}
                      onClick={() => handleLike(item._id)}
                    >
                      <FaHeart /> {item.likes.length}
                    </Button>

                    <Button variant="link" className="text-muted p-0">
                      <FaCommentDots /> {item.commentCount || 0} Comment
                    </Button>
                  </div>

                  <CommentSection
                    postId={item._id}
                    onCommentAdded={() => {
                      setPosts((prev) =>
                        prev.map((post) =>
                          post._id === item._id
                            ? {
                                ...post,
                                commentCount:
                                  (post.commentCount || 0) + 1,
                              }
                            : post
                        )
                      );
                    }}
                  />
                </div>
              </div>
            );
          })}
        </Masonry>
      )}
    </div>
  );
}

export default Dashboard;
