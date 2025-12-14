import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router";
import ApiClient from "../../utils/ApiClient";
import Table from "react-bootstrap/Table";

interface Progress {
    _id: string;
    userId: string;
    imageUrl: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

function Progress() {
    const [progress, setProgress] = useState<Progress[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchProgress = useCallback(async () => {
        const response = await ApiClient.get("/progress");

        if (response.status === 200) {
        setProgress(response.data.data);
        setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProgress();
    }, [fetchProgress]);

    const handleDelete = async (progressId: string) => {
        const response = await ApiClient.delete(`/progress/${progressId}`);

        if (response.status === 200) {
        fetchProgress();
        }
    };

    return (
        <div className="container mx-auto">
        <div className="d-flex justify-content-between mb-3">
            <h2>Progress</h2>
            <NavLink to="/add-progress" className="btn btn-primary">
            Add Progress
            </NavLink>
        </div>

        <div>
            <Table striped bordered hover size="sm">
            <thead>
                <tr>
                <th>No</th>
                <th>User</th>
                <th>Image</th>
                <th>Description</th>
                <th>Aksi</th>
                </tr>
            </thead>

            <tbody>
                {loading && (
                <tr>
                    <td colSpan={5}>Loading...</td>
                </tr>
                )}

                {progress.length > 0 &&
                progress.map((item, index) => (
                    <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.userId}</td>
                    <td>
                        <img
                        src={`http://localhost:3000/${item.imageUrl}`}
                        alt="progress"
                        width={60}
                        height={60}
                        style={{ objectFit: "cover" }}
                        />
                    </td>
                    <td>{item.description}</td>
                    <td>
                        <NavLink
                        to={`/edit-progress/${item._id}`}
                        className="btn btn-primary btn-sm me-2"
                        >
                        Edit
                        </NavLink>
                        <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleDelete(item._id)}
                        >
                        Delete
                        </button>
                    </td>
                    </tr>
                ))}
            </tbody>
            </Table>
        </div>
        </div>
    );
}

export default Progress;
