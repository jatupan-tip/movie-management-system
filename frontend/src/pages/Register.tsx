import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import hidden from "../assets/hidden.png";
import view from "../assets/view.png";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      alert("Please fill all fields");

      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");

      return;
    }

    try {
      await api.post("/auth/register", {
        username,
        email,
        password,
      });

      alert("Register success");

      navigate("/");
    } catch (error) {
      console.log(error);

      alert("Register failed");
    }
  }

  return (
    <div className="register-page">
      {/* <div className="register-background"></div> */}
      <div className="register-logo-box">
        <div className="register-logo"></div>
        <h1>MovieList</h1>
      </div>

      <div className="register-box">
        <h1>Sign up</h1>

        <form onSubmit={handleRegister}>
          <div className="input-group">
            <div className="register-input-box">
              <input
                type="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="register-input-box">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="register-input-box password-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="eye-button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <img src={showPassword ? view : hidden} alt="toggle password" />
              </button>
            </div>
          </div>

          <div className="register-input-box password-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
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
              />
            </button>
          </div>

          <div className="importent-button-box">
            <button type="submit">Sign up</button>
          </div>

          <p>Already have an account?</p>

          <div className="register-button-box">
            <button type="button" onClick={() => navigate("/")}>
              Back to Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
