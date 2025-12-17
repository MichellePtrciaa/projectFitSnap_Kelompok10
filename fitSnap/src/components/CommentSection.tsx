import { useCallback, useEffect, useState } from "react";
import ApiClient from "../utils/ApiClient";

interface Comment {
  _id: string;
  progressId: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string;
}

interface Props {
  progressId: string;
}

const CommentSection = ({ progressId }: Props) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchComments = useCallback(async () => {
    try {
      const response = await ApiClient.get(
        `/progress/${progressId}/comments`
      );

      if (response.status === 200) {
        setComments(response.data.data ?? response.data);
      }
    } catch (error) {
      console.error("Gagal fetch comments:", error);
    } finally {
      setLoading(false);
    }
  }, [progressId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const submitComment = async () => {
    if (!text.trim()) return;

    try {
      const response = await ApiClient.post(
        `/progress/${progressId}/comments`,
        {
          userId: "USER_ID",        // nanti ambil dari auth
          username: "Michelle",    // nanti ambil dari auth
          text,
        }
      );

      if (response.status === 200 || response.status === 201) {
        setComments(prev => [...prev, response.data]);
        setText("");
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
            <b>{comment.username}</b>: {comment.text}
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
