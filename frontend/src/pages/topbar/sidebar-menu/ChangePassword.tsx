import { useState } from "react";
import api from "../../../services/api";
import hidden from "../../../assets/hidden.png";
import view from "../../../assets/view.png";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleChangePassword() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await api.patch(
        "/users/change-password",
        {
          currentPassword,
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Change password success");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.log(error);

      alert(error?.response?.data?.message || "Change password failed");
    }
  }

  return (
    <div className="personal-page">
      <div className="personal-card">
        <h1>Change Password</h1>

        <div className="personal-group">
          <label>Current Password</label>

          <div className="password-container">
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <button
              type="button"
              className="eye-button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              <img
                src={showCurrentPassword ? view : hidden}
                alt="toggle password"
                style={{ filter: "invert(1)" }}
              />
            </button>
          </div>
        </div>

        <div className="personal-group">
          <label>New Password</label>

          <div className="password-container">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              type="button"
              className="eye-button"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              <img
                src={showNewPassword ? view : hidden}
                alt="toggle password"
                style={{ filter: "invert(1)" }}
              />
            </button>
          </div>
        </div>

        <div className="personal-group">
          <label>Confirm Password</label>

          <div className="password-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              type="button"
              className="eye-button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <img
                src={showConfirmPassword ? view : hidden}
                alt="toggle password"
                style={{ filter: "invert(1)" }}
              />
            </button>
          </div>
        </div>

        <div className="personal-actions">
          <button onClick={handleChangePassword}>Change Password</button>
        </div>
      </div>
    </div>
  );
}
