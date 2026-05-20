import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import hidden from "../assets/hidden.png"
import view from "../assets/view.png"

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        const savedEmail = localStorage.getItem("rememberedEmail");
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        try {
            const response = await api.post("/auth/login", {
                email,
                password,
            });

            const token = response.data.data.access_token;

            localStorage.setItem("token", token);

            if (rememberMe) {
                localStorage.setItem("rememberedEmail", email);
            } else {
                localStorage.removeItem("rememberedEmail");
            }

            navigate("/movies");
        } catch (error) {
            console.log(error);

            alert("Login failed");
        }
    }

    return (
        <div className="login-page">
            <div className="login-background"></div>
            <div className="login-logo-box">
                <div className="login-logo"></div>
                <h1>MovieList</h1>
            </div>

            <div className="login-box">
                <h1>Sign in</h1>

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <div className="login-input-box">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="login-input-box password-container">
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
                                <img
                                    src={showPassword ? view : hidden}
                                    alt="toggle password"
                                />
                            </button>
                        </div>
                    </div>

                    <div className="remember-box">
                        <label className="remember-me">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                        </label>
                        <span>Remember me</span>
                    </div>

                    <div className="importent-button-box">
                        <button type="submit">Sign in</button>
                    </div>

                    <p>Don't have an account?</p>

                    <div className="login-button-box">
                        <button type="button" onClick={() => navigate("/register")}>
                            Sign up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
