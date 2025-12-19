import { useCallback, useEffect, useState } from "react";
import ApiClient from "../utils/ApiClient";
import CommentSection from "../components/CommentSection";
import { Button } from "react-bootstrap";
import { FaHeart, FaCommentDots, FaUserCircle } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import Masonry from "react-masonry-css";

interface Post {
  _id: string;
  userId: { username: string } | string;
  imageUrl: string;
  caption: string;
  likes: string[];
  createdAt: string;
}

function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPosts = useCallback(async () => {
    try {
      const response = await ApiClient.get("/progress?isPosted=true");
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
      console.error("Gagal fetch posts:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleLike = async (id: string) => {
    try {
      await ApiClient.post(`/progress/${id}/like`);
      fetchPosts();
    } catch (error) {
      console.error("Gagal like post:", error);
    }
  };

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-gradient">✨ FITSNAP</h2>
        <div className="d-flex gap-2">
          <NavLink to="/signin" className="btn btn-outline-primary">
            Log Out
          </NavLink>
          <NavLink to="/progress" className="btn btn-outline-primary">
            My Progress
          </NavLink>
          <Button
            variant="primary"
            size="sm"
            className="d-flex align-items-center gap-1 rounded-pill px-3"
          >
            <FaUserCircle size={18} /> Profile
          </Button>
        </div>
      </div>

      {/* Body */}
      {loading ? (
        // Skeleton shimmer loader saat loading
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
          {posts.map((item) => (
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
                  @{typeof item.userId === "string" ? item.userId : item.userId.username}
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
                    className="text-danger p-0 btn-like"
                    onClick={() => handleLike(item._id)}
                  >
                    <FaHeart /> {item.likes?.length ?? 0}
                  </Button>
                  <Button variant="link" className="text-muted p-0">
                    <FaCommentDots /> Comment
                  </Button>
                </div>
                <CommentSection progressId={item._id} />
              </div>
            </div>
          ))}
        </Masonry>
      )}
    </div>
  );
}

export default Dashboard;