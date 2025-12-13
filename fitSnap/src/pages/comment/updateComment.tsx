import { useState } from "react";
import { updateCommentApi } from "../../api/commentApi";


interface Props {
id: string;
initialComment: string;
onSuccess?: () => void;
}


export default function UpdateComment({ id, initialComment, onSuccess }: Props) {
const [comment, setComment] = useState(initialComment);


const handleUpdate = async () => {
await updateCommentApi(id, comment);
onSuccess?.();
};


return (
<div className="flex gap-2">
<input
className="border p-2 flex-1 rounded"
value={comment}
onChange={(e) => setComment(e.target.value)}
/>
<button onClick={handleUpdate} className="text-blue-600 text-sm">
Update
</button>
</div>
);
}