import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setServerError("");
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      setServerError("");

      const res = await api.post("/user/login", {
        email: form.email.trim(),
        password: form.password,
      });

      const { token, user } = res.data;

      if (!token) {
        setServerError("Login succeeded but token was not returned.");
        return;
      }

      setAuth({ token, user });
      navigate("/", { replace: true });
    } catch (err) {
      setServerError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login to your account</h2>

        <p className="create-text">
          Don’t have an account?{" "}
          <Link className="create-link" to="/register">
            Create a new account
          </Link>
        </p>

        {serverError && <div className="server-error">{serverError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && <small className="error">{errors.email}</small>}
          </div>

          <div className="field password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword((p) => !p)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

            {errors.password && (
              <small className="error">{errors.password}</small>
            )}
          </div>

          {/* ✅ Forgot password link */}
          <p className="forgot-row">
            <Link className="forgot-link" to="/forgot-password">
              Forgot password?
            </Link>
          </p>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
