import { useState, type ChangeEvent, type FormEvent } from "react"
import { Button, Form } from "react-bootstrap"
import { NavLink, useNavigate } from "react-router"
import ApiClient from "../../utils/ApiClient"

function AddProgress() {
  const navigate = useNavigate()

  const [description, setDescription] = useState("")
  const [image, setImage] = useState<File | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("description", description);
  if (image) {
    formData.append("image", image);
  }

  

  try {
    const token = localStorage.getItem("token"); // ambil token
    const response = await ApiClient.post("/progress", formData, {
      headers: {
        Authorization: `Bearer ${token}`,   // tambahkan ini
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("RESPONSE:", response);
    navigate("/progress"); // redirect setelah sukses
  } catch (error) {
    console.error("ERROR POST:", error);
  }
};


  return (
    <div className="container mx-auto">
      <h2>Add Progress</h2>
      <NavLink to="/progress" className="btn btn-secondary mb-3">
        Back
      </NavLink>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            type="text"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Photo</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setImage(e.target.files?.[0] || null)
            }
          />
        </Form.Group>

        <Button type="submit">Post</Button>
      </Form>
    </div>
  )
}

export default AddProgress
