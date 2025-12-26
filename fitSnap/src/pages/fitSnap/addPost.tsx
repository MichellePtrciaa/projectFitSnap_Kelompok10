import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button, Form, Alert, Toast, ToastContainer, Spinner } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router";
import ApiClient from "../../utils/ApiClient";

function AddPost() {
  const navigate = useNavigate();

  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "danger">("success");

  const [loading, setLoading] = useState(false);

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
    formData.append("image", image); // ✅ harus "image" sesuai upload.single("image")

    try {
      const token = localStorage.getItem("token");
      const response = await ApiClient.post("/post", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // ❌ jangan set Content-Type manual, biar axios/fetch generate boundary otomatis
        },
      });

      console.log("RESPONSE:", response);

      setCaption("");
      setImage(null);
      setPreview(null);

      setToastMessage("Postingan berhasil ditambahkan!");
      setToastVariant("success");
      setShowToast(true);

      setTimeout(() => navigate("/post"), 1500);
    } catch (error) {
      console.error("ERROR POST:", error);
      setToastMessage("Gagal menambahkan postingan");
      setToastVariant("danger");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  return (
    <div className="container mx-auto">
      <h2>Add Post</h2>
      <NavLink to="/postModel" className="btn btn-secondary mb-3">
        Back
      </NavLink>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Caption</Form.Label>
          <Form.Control
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            type="text"
            placeholder="Tulis caption..."
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Photo</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
        </Form.Group>

        {preview && (
          <div className="mb-3 text-center">
            <img
              src={preview}
              alt="preview"
              className="img-fluid rounded shadow-sm"
              style={{ maxHeight: "250px", objectFit: "cover" }}
            />
          </div>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{" "}
              Loading...
            </>
          ) : (
            "Post"
          )}
        </Button>
      </Form>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg={toastVariant}
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={2000}
          autohide
        >
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default AddPost;