import CommentSection from "./CommentSection";
import type { Progress } from "../models/postModel.ts";
import { useState, useEffect } from "react";
import ApiClient from "../utils/ApiClient";

const ProgressCard = ({ progress }: { progress: Progress }) => {
  const [commentCount, setCommentCount] = useState<number |null>(null);

  const userId = "USER_LOGIN_ID"; // dari auth

  const handleLike = async () => {
    await ApiClient.post(`/progress/${progress._id}/like`, { userId });
    
  };
  useEffect(() => {
  console.log("Comment count update:", commentCount);
  }, [commentCount]);

  return (
    <div className="border rounded p-4">
      <h3 className="font-bold">@{progress.userId?.username}</h3>

      <img src={progress.imageUrl} className="rounded my-2" />

      <p>{progress.description}</p>

    <div className="flex gap-4 item-center mb-2">
      <button onClick={handleLike}>
        ❤️ {progress.likes?.length ?? 0}
      </button>

       <span>💬 {commentCount ?? "..."} Comment</span>
      </div>

      <CommentSection 
        postId={progress._id} 
        onCountChange={setCommentCount}
      />
    </div>
  );
};

export default ProgressCard;
