import { useEffect, useState } from "react";
import ApiClient from "../../utils/ApiClient";
import { useNavigate } from "react-router-dom"
import { FaUserEdit, FaSignOutAlt, FaTrash, FaArrowLeft } from "react-icons/fa";

type UserProfile = {
  username: string;
  email?: string;
  bio?: string;
};

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    ApiClient.get("/profile").then((res) => {
      setUser(res.data);
      setUsername(res.data.username);
      setBio(res.data.bio || "");
    });
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const url = URL.createObjectURL(file);
    setPhoto(url);
    localStorage.setItem("profilePhoto", url);
  }
};

  const handleSave = () => {
    ApiClient.put("/profile", { username, bio, profilePicture: photo })
  .then((res) => {
    localStorage.setItem("token", res.data.token);
    setUser(res.data.data);
    setIsEditing(false);
  });

  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/signIn";
  };

  const handleDeleteAccount = () => {
    if (confirm("Yakin mau hapus akun? 😭")) {
      ApiClient.delete("/profile").then(() => {
        localStorage.removeItem("token");
        window.location.href = "/signUp";
      });
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        display: "flex",
        justifyContent: "center",
        paddingTop: 60,
      }}
    >
        
      <div
        style={{
          width: 420,
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        {/* Tombol Back */}
  <div style={{ textAlign: "left", marginBottom: 16 }}>
    <button
      onClick={() => navigate(-1)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        borderRadius: 8,
        border: "1px solid #e5e7eb",
        background: "#fff",
        cursor: "pointer",
        fontWeight: 500,
      }}
    >
      <FaArrowLeft /> Back
    </button>
    </div>
        {/* Avatar */}
        <div style={{ textAlign: "center" }}>
          <img
            src={photo || "/assets/Logo-FitSnap.png"}
            alt="profile"
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              objectFit: "cover",
              border: "4px solid #e9d5ff",
            }}
          />

          <label style={{ display: "block", marginTop: 8 }}>
            <input type="file" hidden onChange={handlePhotoChange} />
            <span
              style={{
                fontSize: 13,
                color: "#7c3aed",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Ganti foto
            </span>
          </label>
        </div>

        {/* Info */}
        {!isEditing ? (
          <>
            <h2 style={{ textAlign: "center", marginTop: 16 }}>
              @{user.username}
            </h2>
            <p
              style={{
                textAlign: "center",
                color: "#64748b",
                fontSize: 14,
              }}
            >
              {user.bio || "Belum ada bio"}
            </p>

            <button
              onClick={() => setIsEditing(true)}
              style={btnPrimary}
            >
              <FaUserEdit /> Edit Profile
            </button>
          </>
        ) : (
          <>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              style={inputStyle}
            />

            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Bio"
              style={{ ...inputStyle, height: 80 }}
            />

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={handleSave} style={btnPrimary}>
                Simpan
              </button>
              <button
                onClick={() => setIsEditing(false)}
                style={btnSecondary}
              >
                Batal
              </button>
            </div>
          </>
        )}

        <hr style={{ margin: "24px 0" }} />

        {/* Actions */}
        <button onClick={handleLogout} style={btnSecondary}>
          <FaSignOutAlt /> Logout
        </button>

        <button
          onClick={handleDeleteAccount}
          style={{
            ...btnSecondary,
            color: "#dc2626",
            borderColor: "#fecaca",
          }}
        >
          <FaTrash /> Hapus Akun
        </button>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  marginBottom: 12,
};

const btnPrimary: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  borderRadius: 999,
  background: "#6366f1",
  color: "#fff",
  border: "none",
  fontWeight: 600,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: 8,
  marginTop: 12,
};

const btnSecondary: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  borderRadius: 999,
  background: "#fff",
  border: "1px solid #e5e7eb",
  marginTop: 10,
  fontWeight: 500,
};

export default Profile;
