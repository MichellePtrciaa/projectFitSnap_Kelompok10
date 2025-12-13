import { deleteCommentApi } from "../../api/commentApi";


interface Props {
id: string;
onSuccess?: () => void;
}


export default function DeleteComment({ id, onSuccess }: Props) {
const handleDelete = async () => {
if (!confirm("Hapus komentar?")) return;
await deleteCommentApi(id);
onSuccess?.();
};


return (
<button onClick={handleDelete} className="text-red-500 text-xs">
Hapus
</button>
);
}