import { useEffect, useState } from "react"
import { useNavigate, NavLink } from "react-router"
import ApiClient from "../../utils/ApiClient"
import { Card, Button, Form } from "react-bootstrap"
import type { PostModel } from "../../models/postModel"

function PostPage() {
  const [posts, setPosts] = useState<PostModel[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await ApiClient.get("/post", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setPosts(response.data.data)
      } catch (error) {
        console.error("Error fetching posts:", error)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div className="container mt-4">
      {/* Header dengan judul di kiri dan tombol Add di kanan */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-gradient">✨ FITSNAP</h2>
        <NavLink to="/addPost" className="btn btn-dark btn-pill">
            ➕ Add
        </NavLink>
          {/* Tombol Back ke Dashboard */}
        <NavLink to="/post" className="btn btn-outline-primary btn-pill">
            ⬅️ Back to home?
        </NavLink>
      </div>

      {posts.map((post) => (
        <Card key={post._id} className="mb-4 shadow-sm">
          <Card.Body>
            <Card.Title>@{post.userId}</Card.Title>
            <Card.Subtitle className="text-muted mb-2">
              {new Date(post.createdAt).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </Card.Subtitle>

            {/* Klik gambar → navigate ke progress */}
            <div
              onClick={() => navigate(`/progress/${post._id}`)}
              style={{ cursor: "pointer" }}
            >
              <Card.Img variant="top" src={post.imageUrl} alt={post.caption} />
            </div>

            <p className="mt-3">{post.caption}</p>

            <div className="d-flex justify-content-between text-muted">
              <span>0 ❤️</span>
              <span>0 💬</span>
            </div>

            <hr />
            <div>
              <p className="mb-1">💬 Komentar</p>
              <p className="text-muted">Belum ada komentar</p>
              <Form.Control
                type="text"
                placeholder="Tulis komentar..."
                className="mb-2"
              />
              <Button variant="primary">Kirim</Button>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  )
}

export default PostPage
