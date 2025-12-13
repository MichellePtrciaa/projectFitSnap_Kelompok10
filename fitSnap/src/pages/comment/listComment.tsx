import { useEffect, useState } from "react";
import { listCommentApi } from "../../api/commentApi";
import { Comment } from "../../types/comment";
import DeleteComment from "./deleteComment";


interface Props {
postId: string;
}


export default function ListComment({ postId }: Props) {
const [comments, setComments] = useState<Comment[]>([]);


const fetchComments = async () => {
const res = await listCommentApi(postId);
setComments(res.data.data);
};


useEffect(() => {
fetchComments();
}, [postId]);


return (
<div className="mt-4">
{comments.map((c) => (
<div key={c._id} className="border p-2 rounded mb-2">
<p className="text-sm">{c.comment}</p>
<DeleteComment id={c._id} onSuccess={fetchComments} />
</div>
))}
</div>
);
}