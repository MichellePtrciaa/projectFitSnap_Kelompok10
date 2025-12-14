import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router";
import ApiClient from "../../utils/ApiClient";
import Table from "react-bootstrap/Table";

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
    const response = await ApiClient.get("/comment");
    if (response.status === 200) {
      setComments(response.data.data);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleDelete = async (commentId: string) => {
    const response = await ApiClient.delete(`/comment/${commentId}`);
    if (response.status === 200) {
      fetchComments();
    }
  };

  return (
    <div className="container mx-auto">
      <div className="d-flex justify-content-between mb-3">
        <h2>Comments</h2>
        <NavLink to="/add-comment" className="btn btn-primary">
          Add Comment
        </NavLink>
      </div>
      <div>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>No</th>
              <th>User</th>
              <th>Image</th>
              <th>Description</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5}>Loading...</td>
              </tr>
            )}
            {comments.length > 0 &&
              comments.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.userId}</td>
                  <td>
                    <img
                      src={`http://localhost:3000/${item.imageUrl}`}
                      alt="comment"
                      width={60}
                      height={60}
                      style={{ objectFit: "cover" }}
                    />
                  </td>
                  <td>{item.description}</td>
                  <td>
                    <NavLink
                      to={`/edit-comment/${item._id}`}
                      className="btn btn-primary btn-sm me-2"
                    >
                      Edit
                    </NavLink>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default CommentPage;