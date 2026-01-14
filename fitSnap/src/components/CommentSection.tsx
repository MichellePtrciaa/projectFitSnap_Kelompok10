import { useCallback, useEffect, useState } from "react";
import ApiClient from "../utils/ApiClient";

interface Comment {
  _id: string;
  postId: string;
  comment: string;
  createdAt: string;
  userId?:{
    _id: string;
    username: string;
  }
}

interface Props {
  postId: string;
  onCommentAdded?: () => void;
}

const CommentSection = ({ postId, onCommentAdded }: Props) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchComments = useCallback(async () => {
    if(!postId) return;

    try {
      const response = await ApiClient.get(
        `/comment?postId=${postId}`
      );

      if (response.status === 200) {
        const data = response.data.data ?? response.data;

        console.log("Isi Komentar", data);

        const total = Array.isArray(data) ? data.length : 0;

        setComments(Array.isArray(data) ? data : []);

console.log("Jumlah Komen:", total);
      }
    } catch (error) {
      console.error("Gagal fetch comments:", error);
    } finally {
      setLoading(false);
    }
  }, [postId, onCommentAdded]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const submitComment = async () => {

    if (!text.trim() || !postId){
      console.log("Text / ID kosong");
      return;
    }

    try {
      const response = await ApiClient.post(
        `/comment`,
        {
          postId,  // nanti ambil dari auth
          comment:text   // nanti ambil dari auth
        }
      );
      console.log("Response", response.data);

      if (response.status === 200 || response.status === 201) {
        setText("");
        fetchComments();
        console.log("🔥 COMMENT ADDED");

        onCommentAdded?.();
      }
    } catch (error) {
      console.error("Gagal kirim komentar:", error);
    }
  };

  return (
    <div className="mt-3">
      <h6 className="fw-semibold">💬 Komentar</h6>

      {loading ? (
        <p className="text-muted">Loading komentar...</p>
      ) : comments.length === 0 ? (
        <p className="text-muted">Belum ada komentar</p>
      ) : (
        comments.map(comment => (
          <div key={comment._id} className="mb-1">
            <b>{comment.userId?.username || "User"}</b>: {comment.comment}
          </div>
        ))
      )}

      <div className="d-flex gap-2 mt-2">
        <input
          type="text"
          className="form-control form-control-sm"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Tulis komentar..."
        />
        <button
          className="btn btn-primary btn-sm"
          onClick={submitComment}
        >
          Kirim
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
