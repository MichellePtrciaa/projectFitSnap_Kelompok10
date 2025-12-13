import { useEffect, useState } from "react";
import { detailCommentApi } from "../../api/commentApi";
import { Comment } from "../../types/comment";


interface Props {
id: string;
}


export default function DetailComment({ id }: Props) {
const [comment, setComment] = useState<Comment | null>(null);


useEffect(() => {
detailCommentApi(id).then((res) => setComment(res.data.data));
}, [id]);


if (!comment) return null;


return <p>{comment.comment}</p>;
}