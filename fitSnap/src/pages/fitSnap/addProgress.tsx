import { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import ApiClient from "../../utils/ApiClient"

function addProgress(){
    const navigate = useNavigate()

    const [userId, setUserId] = useState<string>("")
    const [imageUrl, setImageUrl] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const response = await ApiClient.post("/progress", {
            userId,
            imageUrl,
            description
        })

        if (response.status === 201 || response.status === 200) {
            navigate("/progress")
        }

        setLoading(false)
    }

    return (
        <div className="container mt-4">
            <h2>Add Progress</h2>

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
                        type="text"
                        className="form-control"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
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

                <button className="btn btn-primary" disabled={loading}>
                    {loading ? "Saving..." : "Save"}
                </button>
            </form>
        </div>
    )
}

export default addProgress