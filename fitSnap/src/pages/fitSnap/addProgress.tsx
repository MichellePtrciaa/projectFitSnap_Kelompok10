import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button, Form, Alert, Spinner } from "react-bootstrap";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import ApiClient from "../../utils/ApiClient";

function AddProgress() {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();

  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // validasi
    if (!postId) {
      setError("Post ID tidak ditemukan");
      return;
    }
    if (!description.trim()) {
      setError("Deskripsi wajib diisi");
      return;
    }
    if (!image) {
      setError("Foto wajib dipilih");
      return;
    }

    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("description", description);
    formData.append("image", image); // HARUS "image"

    try {
      await ApiClient.post(
        `/progress/${postId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // sukses → balik ke detail post
      navigate(`/post/${postId}`);
    } catch (err) {
      console.error("ERROR ADD PROGRESS:", err);
      setError("Gagal menambahkan progress");
    } finally {
      setLoading(false);
    }
  };

  /* ================= IMAGE ================= */
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-3">➕ Add Progress</h2>

      <NavLink
        to={`/post/${postId}`}
        className="btn btn-outline-secondary mb-3"
      >
        ⬅️ Back
      </NavLink>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tulis progress kamu..."
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
              <Spinner size="sm" animation="border" className="me-2" />
              Uploading...
            </>
          ) : (
            "Post Progress"
          )}
        </Button>
      </Form>
    </div>
  );
}

export default AddProgress;
