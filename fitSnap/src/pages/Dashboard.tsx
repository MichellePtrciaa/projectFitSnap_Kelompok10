import { useCallback, useEffect, useState } from "react";
import ApiClient from "../utils/ApiClient";
import CommentSection from "../components/CommentSection";
import { Spinner, Card, Button, Badge } from "react-bootstrap";

interface Progress {
  _id: string;
  userId: string;
  imageUrl: string;
  description: string;
  likes: string[];
  createdAt: string;
}

function Dashboard() {
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProgress = useCallback(async () => {
    try {
      const response = await ApiClient.get("/progress");

      if (response.status === 200) {
        const data = response.data;
        const progressData = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];

        setProgress(progressData);
      }
    } catch (error) {
      console.error("Gagal fetch progress:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return (
    <div className="container py-4" style={{ maxWidth: "720px" }}>
      {/* Header */}
      <div className="mb-4 text-center">
        <h2 className="fw-bold">🏃‍♀️ FitSnap Dashboard</h2>
        <p className="text-muted">
          Lihat dan dukung progress olahraga teman-temanmu
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : progress.length === 0 ? (
        <div className="text-center text-muted">
          <p>Belum ada progress yang dibagikan.</p>
        </div>
      ) : (
        progress.map(item => (
          <Card key={item._id} className="mb-4 shadow-sm border-0">
            {/* Header Card */}
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <h6 className="mb-0 fw-semibold">{item.userId}</h6>
                  <small className="text-muted">
                    {new Date(item.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </small>
                </div>
                <Badge bg="success">Progress</Badge>
              </div>

              {/* Image */}
              <div className="mb-3">
                <img
                  src={`http://localhost:3000/${item.imageUrl}`}
                  alt="progress"
                  className="img-fluid rounded"
                  style={{
                    width: "100%",
                    maxHeight: "320px",
                    objectFit: "cover",
                  }}
                />
              </div>

              {/* Description */}
              <Card.Text className="mb-2">
                {item.description}
              </Card.Text>

              {/* Like */}
              <div className="d-flex align-items-center gap-2 mb-3">
                <Button
                  variant="outline-danger"
                  size="sm"
                >
                  ❤️ {item.likes.length}
                </Button>
                <span className="text-muted small">
                  orang menyukai ini
                </span>
              </div>

              {/* Comment */}
              <CommentSection progressId={item._id} />
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
}

export default Dashboard;
