import { useCallback, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import ApiClient from "../../utils/ApiClient";
import { Modal, Button, Form } from "react-bootstrap";

/* ================= TYPE ================= */
type Progress = {
  _id: string;
  postId: string;
  userId: {
    _id: string;
    username: string;
  };
  description: string;
  imageUrl?: string;
  createdAt: string;
};

/* ================= IMAGE HELPER ================= */
const getImageUrl = (path?: string) =>
  path ? `http://localhost:3000/${path}` : "";

function ProgressPage() {
  const { postId } = useParams(); // 👈 ambil dari URL
  const [progress, setProgress] = useState<Progress[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  /* ===== modal edit ===== */
  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editDesc, setEditDesc] = useState("");
  const [editImage, setEditImage] = useState<string | null>(null);

  /* ================= FETCH ================= */
  const fetchProgress = useCallback(async () => {
    try {
      const endpoint = postId
        ? `/progress/post/${postId}` // dari Dashboard
        : `/progress/my`; // My Progress

      const res = await ApiClient.get(endpoint);
      setProgress(res.data.data || []);
    } catch (error) {
      console.error("Gagal fetch progress:", error);
    }
  }, [postId]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {
    if (!window.confirm("Yakin ingin menghapus progress ini?")) return;

    try {
      await ApiClient.delete(`/progress/${id}`);
      fetchProgress();
    } catch (error) {
      console.error("Gagal hapus progress:", error);
    }
  };

  /* ================= EDIT ================= */
  const handleEditOpen = (
    id: string,
    desc: string,
    imageUrl?: string
  ) => {
    setEditId(id);
    setEditDesc(desc);
    setEditImage(getImageUrl(imageUrl));
    setShowEdit(true);
  };

  const handleEditSave = async () => {
    if (!editId) return;

    try {
      await ApiClient.put(`/progress/${editId}`, {
        description: editDesc,
      });
      setShowEdit(false);
      setEditId(null);
      setEditDesc("");
      setEditImage(null);
      fetchProgress();
    } catch (error) {
      console.error("Gagal edit progress:", error);
    }
  };

  return (
    <div className={`container py-4 ${darkMode ? "dark-mode" : ""}`}>
      {/* ===== HEADER ===== */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">🏃 Progress</h2>

        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>

          {!postId && (
            <NavLink to="/add-progress" className="btn btn-primary">
              ➕ Add Progress
            </NavLink>
          )}

          <NavLink to="/postModel" className="btn btn-outline-primary">
            ⬅️ Dashboard
          </NavLink>
        </div>
      </div>

      {/* ===== GRID ===== */}
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {progress.map((item) => (
          <div key={item._id} className="col">
            <div className="card shadow-sm border-0 h-100">
              {item.imageUrl && (
                <img
                  src={getImageUrl(item.imageUrl)}
                  className="card-img-top"
                  style={{ height: 220, objectFit: "cover" }}
                />
              )}

              <div className="card-body">
                <h6>@{item.userId.username}</h6>

                <p className="text-muted small">
                  {new Date(item.createdAt).toLocaleDateString("id-ID")}
                </p>

                <p>{item.description}</p>

                {!postId && (
                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      size="sm"
                      variant="outline-warning"
                      onClick={() =>
                        handleEditOpen(
                          item._id,
                          item.description,
                          item.imageUrl
                        )
                      }
                    >
                      ✏️
                    </Button>

                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDelete(item._id)}
                    >
                      🗑️
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== EDIT MODAL ===== */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Progress</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {editImage && (
            <img
              src={editImage}
              className="img-fluid rounded mb-3"
            />
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
