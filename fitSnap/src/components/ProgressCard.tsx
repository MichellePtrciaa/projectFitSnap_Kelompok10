import CommentSection from "./CommentSection";
import axios from "../utils/ApiClient.tsx"
import type { Progress } from "../models/postModel.ts";

const ProgressCard = ({ progress }: { progress: Progress }) => {
  const userId = "USER_LOGIN_ID"; // dari auth

  const handleLike = async () => {
    await axios.post(`/progress/${progress._id}/like`, { userId });
    window.location.reload();
  };

  return (
    <div className="border rounded p-4">
      <h3 className="font-bold">{progress.username}</h3>

      <img src={progress.imageUrl} className="rounded my-2" />

      <p>{progress.description}</p>

      <button onClick={handleLike}>
        ❤️ {progress.likes.length}
      </button>

      <CommentSection progressId={progress._id} />
    </div>
  );
};

export default ProgressCard;
