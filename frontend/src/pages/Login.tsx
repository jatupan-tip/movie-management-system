import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  async function handleLogin(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    try {
      const response = await api.post(
        '/auth/login',
        {
          email,
          password,
        },
      );

      const token =
        response.data.data.access_token;

      localStorage.setItem(
        'token',
        token,
      );

      navigate('/movies');
    } catch (error) {
      console.log(error);

      alert('Login failed');
    }
  }

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />
        </div>

        <button type="submit">
          Login
        </button>
      </form>
    </div>
  );
}