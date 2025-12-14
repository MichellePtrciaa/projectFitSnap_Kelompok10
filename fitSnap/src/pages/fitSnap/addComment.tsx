import { useState } from "react";
import { useNavigate } from "react-router";
import ApiClient from "../../utils/ApiClient";

function AddComment() {
  const [userId, setUserId] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await ApiClient.post("/comment", {
      userId,
      description,
      imageUrl,
    });
    if (response.status === 201) {
      navigate("/comment"); // kembali ke halaman list comment
    }
  };

  return (
    <div className="container">
      <h2>Add Comment</h2>
      <form onSubmit={handleSubmit}>
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
          Save
        </button>
      </form>
    </div>
  );
}

export default AddComment;