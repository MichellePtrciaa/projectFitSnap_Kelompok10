import ApiClient from "../../utils/ApiClient";

const handleDelete = async (commentId: string) => {
  if (window.confirm("Yakin mau hapus comment ini?")) {
    try {
      const response = await ApiClient.delete(`/comment/${commentId}`);
      console.log("Delete response:", response);
      if (response.status === 200) {
        fetchComments();
      } else {
        alert("Gagal menghapus comment");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Terjadi kesalahan saat menghapus");
    }
  }
};

function fetchComments() {
    throw new Error("Function not implemented.");
}
