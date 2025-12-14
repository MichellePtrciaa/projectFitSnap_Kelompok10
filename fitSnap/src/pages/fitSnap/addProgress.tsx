import { useCallback, useState } from "react"
import { NavLink, useNavigate } from "react-router"
import ApiClient from "../../utils/ApiClient"
import { Button } from "react-bootstrap"

function addProgress(){
    
    const navigate = useNavigate()

    const [userId, setUserId] = useState<string>("")
    const [image, setImageUrl] = useState<File | null>(null)
    const [description, setDescription] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
        const token = localStorage.getItem("token") 
        console.log("TOKEN:", token)


        if (!token) {
        alert("Silakan login terlebih dahulu")
        setLoading(false)
        return
        }

        const formData = new FormData()
        formData.append("description", description)

        if (image) {
        formData.append("image", image)
        }

    const response = await ApiClient.post("/progress", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // <--- pastikan Bearer + token
        },
      });
      console.log("SUCCESS:", response.data);
      alert("Progress berhasil ditambahkan");
      // Reset form
      setForm({ UserId: "", description: "" });
      setImageFile(null);
    } catch (error: any) {
      console.error("ERROR:", error.response?.data || error.message);
      alert(
        "Gagal menyimpan progress: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  return (
    <div className="container mx-auto">
      <h2>Add Progress Page</h2>
      <NavLink to="/" className="btn btn-primary mb-3">
        List Progress
      </NavLink>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>User Id</Form.Label>
          <Form.Control
            type="text"
            name="UserId"
            value={form.UserId}
            onChange={handleInputChange}
            placeholder="Masukkan User Id"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            name="description"
            value={form.description}
            onChange={handleInputChange}
            placeholder="Deskripsi progress"
            required
          />
        </Form.Group>

        <Button type="submit" variant="primary">
          Simpan
        </Button>
      </Form>
    </div>
  );
}

export default AddProgress;
