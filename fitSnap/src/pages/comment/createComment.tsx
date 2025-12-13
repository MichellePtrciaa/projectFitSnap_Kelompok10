    import { useState } from "react";
import { createCommentApi } from "../../api/";


interface Props {
postId: string;
onSuccess?: () => void;
}


export default function CreateComment({ postId, onSuccess }: Props) {
const [comment, setComment] = useState("");


const handleSubmit = async () => {
if (!comment) return;
await createCommentApi(postId, comment);
setComment("");
onSuccess?.();
};


return (
<div className="flex gap-2">
<input
className="border p-2 flex-1 rounded"
placeholder="Tulis komentar"
value={comment}
onChange={(e) => setComment(e.target.value)}
/>
<button onClick={handleSubmit} className="bg-black text-white px-3 rounded">
Kirim
</button>
</div>
);
}