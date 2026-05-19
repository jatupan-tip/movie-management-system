import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    try {
      await api.post("/auth/register", {
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
    <div>
      <h1>Register</h1>

      <form onSubmit={handleRegister}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Register</button>

        <p>Already have an account?</p>

        <button type="button" onClick={() => navigate("/")}>
          Login
        </button>
      </form>
    </div>
  );
}
