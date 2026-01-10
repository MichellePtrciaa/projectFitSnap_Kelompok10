import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  Button,
  Form,
  Alert,
  Toast,
  ToastContainer,
  Spinner,
} from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import ApiClient from "../../utils/ApiClient";

/* helper preview */
const getPreviewUrl = (file: File) => URL.createObjectURL(file);

function AddPost() {
  const navigate = useNavigate();

  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] =
    useState<"success" | "danger">("success");

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!caption.trim()) {
      setError("Caption wajib diisi");
      return;
    }
    if (!image) {
      setError("Foto wajib dipilih");
      return;
    }

    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", image); // ✅ sesuai multer

    try {
      await ApiClient.post("/post", formData);

      setToastMessage("Postingan berhasil ditambahkan!");
      setToastVariant("success");
      setShowToast(true);

      setCaption("");
      setImage(null);
      setPreview(null);

      // ⏱️ beri waktu toast tampil
      setTimeout(() => navigate("/post"), 1200);
    } catch (err) {
      console.error("ERROR ADD POST:", err);
      setToastMessage("Gagal menambahkan postingan");
      setToastVariant("danger");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  /* ================= IMAGE ================= */
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    setPreview(file ? getPreviewUrl(file) : null);
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-3">➕ Add Post</h2>

      <NavLink to="/post" className="btn btn-outline-secondary mb-3">
        ⬅️ Back
      </NavLink>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Caption</Form.Label>
          <Form.Control
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Tulis caption..."
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Photo</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </Form.Group>

        {preview && (
          <div className="mb-3 text-center">
            <img
              src={preview}
              alt="preview"
              className="img-fluid rounded shadow-sm"
              style={{ maxHeight: 260, objectFit: "cover" }}
            />
          </div>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                className="me-2"
              />
              Uploading...
            </>
          ) : (
            "Post"
          )}
        </Button>
      </Form>

      {/* TOAST */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg={toastVariant}
          show={showToast}
          delay={2000}
          autohide
          onClose={() => setShowToast(false)}
        >
          <Toast.Body className="text-white">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default AddPost;
