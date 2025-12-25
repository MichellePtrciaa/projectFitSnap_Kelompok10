import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import ApiClient from "../../utils/ApiClient";
import { type Progress } from "../../models/postModel.ts";
import { Modal, Button, Form } from "react-bootstrap";

function ProgressPage() {
  const [progress, setProgress] = useState<Progress[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  // state untuk modal edit
  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editDesc, setEditDesc] = useState("");
  const [editImage, setEditImage] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    const response = await ApiClient.get("/progress/draft"); // hanya draft
    if (response.status === 200) {
      setProgress(response.data.data || []);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus progress ini?");
    if (!confirmDelete) return;

    try {
      await ApiClient.delete(`/progress/${id}`);
      fetchProgress();
    } catch (error) {
      console.error("Gagal menghapus progress:", error);
    }
  };

  const handleEditOpen = (id: string, currentDesc: string, imageUrl?: string) => {
    setEditId(id);
    setEditDesc(currentDesc);
    setEditImage(imageUrl ? `http://localhost:3000/${imageUrl}` : null);
    setShowEdit(true);
  };

  const handleEditSave = async () => {
    if (!editId) return;
    try {
      await ApiClient.put(`/progress/${editId}`, { description: editDesc });
      setShowEdit(false);
      setEditId(null);
      setEditDesc("");
      setEditImage(null);
      fetchProgress();
    } catch (error) {
      console.error("Gagal edit progress:", error);
    }
  };

  const handlePost = async (id: string) => {
    try {
      await ApiClient.put(`/progress/${id}`, { isPosted: true });
      fetchProgress();
    } catch (error) {
      console.error("Gagal mem-publish progress:", error);
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
          <NavLink to="/add-progress" className="btn btn-dark btn-pill">
            ➕ Add
          </NavLink>
          {/* Tombol Back ke Dashboard */}
          <NavLink to="/postModel" className="btn btn-outline-primary btn-pill">
            ⬅️ Post
          </NavLink>
        </div>
      </div>

      {/* Grid Gallery */}
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {progress.map((item) => (
          <div key={item._id} className="col">
            <div className="card h-100 shadow-sm border-0 modern-card">
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
                    className="btn btn-sm btn-outline-warning btn-pill"
                    onClick={() =>
                      handleEditOpen(item._id, item.description, item.imageUrl)
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
                  <button
                    className="btn btn-sm btn-outline-success btn-pill"
                    onClick={() => handlePost(item._id)}
                  >
                    🚀 Post
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
          <Modal.Title>Edit Progress</Modal.Title>
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
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
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

export default ProgressPage;