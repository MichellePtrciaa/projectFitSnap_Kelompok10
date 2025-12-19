import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ApiClient from "../../utils/ApiClient";

function AddComment() {
  const { id } = useParams<{ id: string }>(); // progressId dari URL
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await ApiClient.post(`/comment/${id}`, {
        description,
        imageUrl,
      });
      if (response.status === 201) {
        navigate(`/comment/${id}`); // balik ke halaman komentar progress ini
      }
    } catch (error) {
      console.error("Gagal tambah komentar:", error);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold">➕ Add Comment</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Image URL (opsional)</label>
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