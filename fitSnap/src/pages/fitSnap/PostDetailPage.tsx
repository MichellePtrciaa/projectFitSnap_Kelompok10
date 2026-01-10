import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import ApiClient from "../../utils/ApiClient";

interface Progress {
  _id: string;
  description: string;
  imageUrl: string;
  userId: {
    username: string;
  };
  createdAt: string;
}

interface Post {
  _id: string;
  caption: string;
  imageUrl: string;
  userId: {
    username: string;
  };
}

function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>(); // ✅ TYPE
  const [post, setPost] = useState<Post | null>(null);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;

    fetchPost();
    fetchProgress();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const res = await ApiClient.get(`/post/${postId}`);
      setPost(res.data.data);
    } catch (err) {
      console.error("Gagal fetch post:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const res = await ApiClient.get(`/progress/post/${postId}`);
      setProgress(res.data.data || []);
    } catch (err) {
      console.error("Gagal fetch progress:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post tidak ditemukan</p>;

  return (
    <div className="container py-4">
      {/* POST */}
      <div className="card mb-4 shadow-sm">
        <img
          src={`http://localhost:3000/${post.imageUrl}`}
          className="card-img-top"
          alt="post"
        />
        <div className="card-body">
          <h5>@{post.userId.username}</h5>
          <p>{post.caption}</p>

        <NavLink
          to={`/post/${post._id}/add-progress`}
          className="btn btn-dark btn-sm"
        >
          ➕ Add Progress
        </NavLink>

        </div>
      </div>

      {/* PROGRESS */}
      <h5 className="mb-3">Progress</h5>

      {progress.length === 0 && (
        <p className="text-muted">Belum ada progress</p>
      )}

      <div className="row g-3">
        {progress.map((item) => (
          <div key={item._id} className="col-md-4">
            <div className="card h-100 shadow-sm">
              <img
                src={`http://localhost:3000/${item.imageUrl}`}
                className="card-img-top"
                style={{ height: 200, objectFit: "cover" }}
                alt="progress"
              />
              <div className="card-body">
                <p className="fw-semibold">@{item.userId.username}</p>
                <p>{item.description}</p>
                <small className="text-muted">
                  {new Date(item.createdAt).toLocaleDateString("id-ID")}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostDetailPage;
