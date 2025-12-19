import { useCallback, useEffect, useState } from "react";
import ApiClient from "../utils/ApiClient";
import CommentSection from "../components/CommentSection";
import { Spinner, Card, Button } from "react-bootstrap";
import { FaHeart, FaCommentDots, FaUserCircle } from "react-icons/fa";
import { NavLink } from "react-router-dom";

interface Post {
  _id: string;
  userId: string;
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
      const response = await ApiClient.get("/post");

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

  return (
    <div className="container py-4" style={{ maxWidth: "640px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-gradient">✨ FITSNAP</h2>
        <div className="d-flex gap-2">
          <NavLink to="/signin" className="btn btn-outline-primary">Log Out</NavLink>
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
        <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center text-muted">
          <p>Belum ada postingan yang dibagikan pengguna lain.</p>
        </div>
      ) : (
        posts.map(item => (
          <Card key={item._id} className="mb-4 border-0 shadow-sm">
            <Card.Body className="p-0">
              <div className="d-flex justify-content-between align-items-center px-3 pt-3">
                <div>
                  <strong>@{item.userId}</strong>
                  <div className="text-muted small">
                    {new Date(item.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-2">
                <img
                  src={`http://localhost:3000/${item.imageUrl}`}
                  alt="post"
                  className="img-fluid"
                  style={{
                    width: "100%",
                    maxHeight: "400px",
                    objectFit: "cover",
                  }}
                />
              </div>

              <div className="px-3 py-2">
                <p className="mb-2">{item.caption}</p>

                <div className="d-flex align-items-center gap-3">
                  <Button variant="link" className="text-danger p-0">
                    <FaHeart /> {item.likes?.length ?? 0}
                  </Button>
                  <Button variant="link" className="text-muted p-0">
                    <FaCommentDots /> Comment
                  </Button>
                </div>
              </div>

              <div className="px-3 pb-3">
                <CommentSection progressId={item._id} />
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
}

export default Dashboard;
