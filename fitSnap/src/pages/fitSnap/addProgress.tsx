import { useCallback, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
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
            Authorization: `Bearer ${token}`, 
        },
        })

        if (response.status === 200 || response.status === 201) {
        navigate("/progress")
        }
        } catch (error) {
            console.error("Add progress error:", error)
            alert("Gagal menambahkan progress")
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="container mt-4">
            <h2>Add Progress</h2>
            <NavLink to="/" className ="btn btn-primary">List Workout</NavLink>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">User ID</label>
                    <input
                        type="text"
                        className="form-control"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Image URL</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]){
                                setImageUrl(e.target.files[0])
                            }
                        }}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <Button type = "submit" variant = "primary">
                    Save
                </Button>
            </form>
        </div>
    )
    
}

export default addProgress