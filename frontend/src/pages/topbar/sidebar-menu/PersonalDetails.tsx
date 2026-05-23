import { useEffect, useState } from "react";
import api from "../../../services/api";

type Props = {
  onProfileUpdated: () => void;
};

type UserProfile = {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
};

export default function PersonalDetails({ onProfileUpdated }: Props) {
  const [user, setUser] = useState<UserProfile | null>(null);

  const [username, setUsername] = useState("");

  async function fetchProfile() {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data.data);

      setUsername(response.data.data.username);
    } catch (error) {
      console.log(error);

      alert("Load profile failed");
    }
  }

  const protectedEmails = [
    "manager@test.com",
    "leader@test.com",
    "staff@test.com",
  ];

  const isProtectedUser = protectedEmails.includes(
    (user?.email ?? "").toLowerCase(),
  );

  async function updateProfile() {
    try {
      const token = localStorage.getItem("token");

      await api.patch(
        "/users/me",
        {
          username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      onProfileUpdated();

      alert("Update profile success");

      fetchProfile();
    } catch (error) {
      console.log(error);

      alert("Update failed");
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="personal-page">
      <div className="personal-card">
        <h1>Personal Details</h1>

        <div className="personal-group">
          <label>Username</label>

          <input
            type="text"
            value={username}
            disabled={isProtectedUser}
            onChange={(e) => setUsername(e.target.value)}
            className={isProtectedUser ? "disabled-input" : ""}
          />
        </div>

        <div className="personal-group">
          <label>Email</label>

          <input type="text" value={user.email} disabled />
        </div>

        <div className="personal-group">
          <label>Role</label>

          <input type="text" value={user.role} disabled />
        </div>

        <div className="personal-group">
          <label>Status</label>

          <input type="text" value={user.status} disabled />
        </div>

        <div className="personal-group">
          <label>Created At</label>

          <input
            type="text"
            value={new Date(user.createdAt).toLocaleDateString()}
            disabled
          />
        </div>

        {!isProtectedUser && (
          <div className="personal-actions">
            <button onClick={updateProfile}>Save Changes</button>
          </div>
        )}
      </div>
    </div>
  );
}
