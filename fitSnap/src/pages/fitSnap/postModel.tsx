import { useCallback, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom"; // ✅ gabungkan import
import ApiClient from "../../utils/ApiClient";
import { Modal, Button, Form } from "react-bootstrap";

// bikin tipe Post biar lebih konsisten
type Post = {
  _id: string;
  caption: string;
  imageUrl: string;
  userId: { username: string };
  createdAt: string;
};

// helper untuk bikin URL gambar
const getImageUrl = (path: string) => {
  return `http://localhost:3000/${path}`; // ✅ backend expose /upload
};

function PostPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  // state untuk modal edit
  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const [editImage, setEditImage] = useState<string | null>(null);

  const navigate = useNavigate(); // ✅ inisialisasi navigate

  const fetchPosts = useCallback(async () => {
    try {
      const response = await ApiClient.get("/post");
      if (response.status === 200) {
        const sorted = (response.data.data || []).sort(
          (a: Post, b: Post) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPosts(sorted);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus post ini?");
    if (!confirmDelete) return;

    try {
      await ApiClient.delete(`/post/${id}`);
      fetchPosts();
    } catch (error) {
      console.error("Gagal menghapus post:", error);
    }
  };

  const handleEditOpen = (id: string, currentCaption: string, imageUrl?: string) => {
    setEditId(id);
    setEditCaption(currentCaption);
    setEditImage(imageUrl ? getImageUrl(imageUrl) : null);
    setShowEdit(true);
  };

  const handleEditSave = async () => {
    if (!editId) return;
    try {
      await ApiClient.put(`/post/${editId}`, { caption: editCaption });
      setShowEdit(false);
      setEditId(null);
      setEditCaption("");
      setEditImage(null);
      fetchPosts();
    } catch (error) {
      console.error("Gagal edit post:", error);
    }
  };

  // ✅ fungsi untuk tombol Post
  const handlePost = async (id: string) => {
    try {
      await ApiClient.put(`/post/${id}`, { isPosted: true });
      navigate("/post"); // ✅ redirect ke halaman post
    } catch (error) {
      console.error("Gagal mem-publish post:", error);
    }
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
          <NavLink to="/addPost" className="btn btn-dark btn-pill">
            ➕ Add
          </NavLink>
          <NavLink to="/post" className="btn btn-outline-primary btn-pill">
            ⬅️ Dashboard
          </NavLink>
        </div>
      </div>

      {/* Grid Gallery */}
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {posts.map((item) => (
          <div key={item._id} className="col">
            <div className="card h-100 shadow-sm border-0 modern-card">
              {item.imageUrl && (
                <div className="position-relative">
                  <img
                    src={getImageUrl(item.imageUrl)} // ✅ pakai helper
                    alt="post"
                    className="card-img-top rounded"
                    style={{ objectFit: "cover", height: "220px" }}
                  />
                  <div className="overlay d-flex justify-content-center align-items-center">
                    <span>{item.caption}</span>
                  </div>
                </div>
              )}

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
                <div className="d-flex justify-content-end gap-2">
                  <button
                    className="btn btn-sm btn-outline-success btn-pill"
                    onClick={() => handlePost(item._id)}
                  >
                    🚀 Post
                  </button>
                  <button
                    className="btn btn-sm btn-outline-warning btn-pill"
                    onClick={() =>
                      handleEditOpen(item._id, item.caption, item.imageUrl)
                    }
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-secondary btn-pill"
                    onClick={() => handleDelete(item._id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editImage && (
            <div className="mb-3 text-center">
              <img
                src={editImage}
                alt="preview"
                className="img-fluid rounded shadow-sm"
                style={{ maxHeight: "200px", objectFit: "cover" }}
              />
            </div>
          )}
          <Form>
            <Form.Group>
              <Form.Label>Caption</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEdit(false)}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleEditSave}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PostPage;