import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router"; // gunakan react-router-dom
import ApiClient from "../../utils/ApiClient";
import { Spinner, Button, Card, Row, Col } from "react-bootstrap";

interface Comment {
  _id: string;
  userId: string;
  imageUrl: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

function CommentPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchComments = useCallback(async () => {
  try {
    const response = await ApiClient.get("/comment");
    console.log("API response:", response);

    if (response.status === 200) {
      const data = response.data;

      // Cek apakah data ada dan berbentuk array
      const commentsData = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];

      setComments(commentsData);
    } else {
      console.warn("Status bukan 200:", response.status);
    }
  } catch (error) {
    console.error("Gagal fetch komentar:", error);
  } finally {
    setLoading(false);
  }
}, []);


  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleDelete = async (commentId: string) => {
    if (window.confirm("Yakin mau hapus komentar ini?")) {
      const response = await ApiClient.delete(`/comment/${commentId}`);
      if (response.status === 200) {
        fetchComments();
      }
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">💬 Comments</h2>
        <NavLink to="/add-comment" className="btn btn-primary">
          ➕ Add Comment
        </NavLink>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center text-muted">
          <p>Belum ada komentar. Yuk tambahkan komentar pertama!</p>
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {comments.map((item) => (
            <Col key={item._id}>
              <Card className="shadow-sm h-100">
                <Card.Img
                  variant="top"
                  src={`http://localhost:3000/${item.imageUrl}`}
                  alt="comment"
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title className="fw-semibold">{item.userId}</Card.Title>
                  <Card.Text>{item.description}</Card.Text>
                  <div className="d-flex justify-content-between">
                    <NavLink
                      to={`/edit-comment/${item._id}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      ✏️ Edit
                    </NavLink>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(item._id)}
                    >
                      🗑️ Delete
                    </Button>
                  </div>
                </Card.Body>
                <Card.Footer className="text-muted small">
                  {new Date(item.createdAt).toLocaleDateString("id-ID")}
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default CommentPage;