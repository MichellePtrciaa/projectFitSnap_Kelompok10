import { useCallback, useEffect, useState } from "react"
import { NavLink } from "react-router"
import ApiClient from "../../utils/ApiClient"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import { type Progress } from "../../models/postModel.ts"

function ProgressPage() {
  const [progress, setProgress] = useState<Progress[]>([])

  const fetchProgress = useCallback(async () => {
    const response = await ApiClient.get("/progress")
    if (response.status === 200) {
      setProgress(response.data.data)
    }
  }, [])

  useEffect(() => {
    fetchProgress()
  }, [fetchProgress])

  const handleLike = async (id: string) => {
    await ApiClient.post(`/progress/${id}/like`)
    fetchProgress()
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between mb-3">
        <h2>FitSnap Dashboard</h2>
        <NavLink to="/add-progress" className="btn btn-primary">
          Add Progress
        </NavLink>
      </div>

      {progress.map((item) => (
        <Card key={item._id} className="mb-4 shadow-sm">
          <Card.Body>
            <Card.Title>@{item.userId.username}</Card.Title>

            {item.imageUrl && (
              <img
                src={`http://localhost:3000/${item.imageUrl}`}
                alt="progress"
                className="img-fluid rounded mb-3"
              />
            )}

            <Card.Text>{item.description}</Card.Text>

            <div className="d-flex justify-content-between">
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleLike(item._id)}
              >
                ❤️ {item.likes}
              </Button>

              <NavLink
                to={`/comment/${item._id}`}
                className="btn btn-outline-primary btn-sm"
              >
                Comment
              </NavLink>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  )
}

export default ProgressPage
