import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApiClient from "../../utils/ApiClient";
import {
  Spinner,
  Button,
  Card,
  Row,
  Col,
  Alert,
  Form,
  Modal,
} from "react-bootstrap";

interface Comment {
  _id: string;
  userId: { username: string } | string;
  imageUrl?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

function CommentPage() {
  const { id } = useParams<{ id: string }>(); // progressId dari URL
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // state untuk form komentar baru
  const [newDesc, setNewDesc] = useState("");
  const [newImage, setNewImage] = useState("");

  // state untuk modal edit
  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editDesc, setEditDesc] = useState("");
  const [editImage, setEditImage] = useState("");

  const resolveImage = (url?: string) => {
    if (!url) return undefined;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `http://localhost:3000/${url.replace(/^\/+/, "")}`;
  };

  const fetchComments = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await ApiClient.get(`/comment/${id}`);
      if (response.status === 200) {
        const data = response.data;
        const commentsData = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];
        setComments(commentsData);
      } else {
        setErrorMsg("Gagal memuat komentar. Coba lagi nanti.");
      }
    } catch (error) {
      console.error("Gagal fetch komentar:", error);
      setErrorMsg("Terjadi kesalahan saat mengambil data komentar.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    setComments([]);
    setLoading(true);
    setErrorMsg("");
  }, [id]);

  const handleDelete = async (commentId: string) => {
    if (!window.confirm("Yakin mau hapus komentar ini?")) return;
    try {
      const response = await ApiClient.delete(`/comment/${commentId}`);
      if (response.status === 200) {
        fetchComments();
      } else {
        setErrorMsg("Gagal menghapus komentar.");
      }
    } catch (error) {
      console.error("Gagal hapus komentar:", error);
      setErrorMsg("Terjadi kesalahan saat menghapus komentar.");
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      const response = await ApiClient.post(`/comment/${id}`, {
        description: newDesc,
        imageUrl: newImage,
      });
      if (response.status === 201) {
        setNewDesc("");
        setNewImage("");
        fetchComments();
      }
    } catch (error) {
      console.error("Gagal tambah komentar:", error);
      setErrorMsg("Terjadi kesalahan saat menambah komentar.");
    }
  };

  const handleEditOpen = (
    commentId: string,
    currentDesc: string,
    currentImage?: string
  ) => {
    setEditId(commentId);
    setEditDesc(currentDesc);
    setEditImage(currentImage || "");
    setShowEdit(true);
  };

  const handleEditSave = async () => {
    if (!editId) return;
    try {
      const response = await ApiClient.put(`/comment/${editId}`, {
        description: editDesc,
        imageUrl: editImage,
      });
      if (response.status === 200) {
        setShowEdit(false);
        setEditId(null);
        setEditDesc("");
        setEditImage("");
        fetchComments();
      }
    } catch (error) {
      console.error("Gagal edit komentar:", error);
      setErrorMsg("Terjadi kesalahan saat mengedit komentar.");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">💬 Comments for Progress {id ?? "-"}</h2>

      {errorMsg && (
        <Alert variant="danger" className="mb-3">
          {errorMsg}
        </Alert>
      )}

      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "200px" }}
        >
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          {comments.length === 0 ? (
            <div className="text-center text-muted mb-3">
              <p>Belum ada komentar. Yuk tambahkan komentar pertama!</p>
            </div>
          ) : (
            <Row xs={1} md={2} lg={3} className="g-4 mb-4">
              {comments.map((item) => (
                <Col key={item._id}>
                  <Card className="shadow-sm h-100">
                    {item.imageUrl && (
                      <Card.Img
                        variant="top"
                        src={resolveImage(item.imageUrl)}
                        alt="comment"
                        style={{ height: "180px", objectFit: "cover" }}
                      />
                    )}
                    <Card.Body>
                      <Card.Title className="fw-semibold">
                        {typeof item.userId === "string"
                          ? item.userId
                          : item.userId.username}
                      </Card.Title>
                      <Card.Text>{item.description}</Card.Text>
                      <div className="d-flex justify-content-between">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() =>
                            handleEditOpen(
                              item._id,
                              item.description,
                              item.imageUrl
                            )
                          }
                        >
                          ✏️ Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(item._id)}
                        >
                          🗑️ Delete
                        </Button>
                      </div>
                    </Card.Body>
                    <Card.Footer className="text-muted small d-flex justify-content-between">
                      <span>
                        {new Date(item.createdAt).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <span>
                        {new Date(item.createdAt).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {/* Form tambah komentar inline */}
          <Form onSubmit={handleAddComment}>
            <Form.Group className="mb-3">
              <Form.Label>Tulis komentar</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL (opsional)</Form.Label>
              <Form.Control
                type="text"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
              />
            </Form.Group>
            <Button type="submit" variant="primary">
              Kirim
            </Button>
          </Form>
        </>
      )}

      {/* Modal edit komentar */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL (opsional)</Form.Label>
              <Form.Control
                type="text"
                value={editImage}
                onChange={(e) => setEditImage(e.target.value)}
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

export default CommentPage;