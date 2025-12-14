import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ApiClient from "../../utils/ApiClient";

function EditComment() {
  const { id } = useParams();
  const [userId, setUserId] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComment = async () => {
      const response = await ApiClient.get(`/comment/${id}`);
      if (response.status === 200) {
        const data = response.data.data;
        setUserId(data.userId);
        setDescription(data.description);
        setImageUrl(data.imageUrl);
      }
    };
    fetchComment();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await ApiClient.put(`/comment/${id}`, {
      userId,
      description,
      imageUrl,
    });
    if (response.status === 200) {
      navigate("/comment");
    }
  };

  return (
    <div className="container">
      <h2>Edit Comment</h2>
      <form onSubmit={handleUpdate}>
        <div className="mb-3">
          <label>User ID</label>
          <input
            type="text"
            className="form-control"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Image URL</label>
          <input
            type="text"
            className="form-control"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Update
        </button>
      </form>
    </div>
  );
}

export default EditComment;