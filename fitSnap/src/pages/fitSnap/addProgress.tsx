import { useState, type ChangeEvent, type FormEvent } from "react";
import { NavLink } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import ApiClient from "../../utils/ApiClient";

interface FormProgress {
  UserId: string;
  description: string;
}

function AddProgress() {
  const [form, setForm] = useState<FormProgress>({
    UserId: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  // Handle text input change
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  // Handle file input change
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImageFile(files[0]);
    } else {
      setImageFile(null);
    }
  };

  // Handle form submit
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!imageFile) {
      alert("Image wajib diupload");
      return;
    }

    const formData = new FormData();
    formData.append("UserId", form.UserId);
    formData.append("description", form.description);
    formData.append("image", imageFile);

    // Ambil token dari localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token tidak ditemukan. Silakan login terlebih dahulu.");
      return;
    }

    try {
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
