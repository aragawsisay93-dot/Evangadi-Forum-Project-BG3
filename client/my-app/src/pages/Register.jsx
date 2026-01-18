import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../services/api";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    agree: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // Handle input changes
  // =========================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setServerError("");
    setErrors((prev) => ({ ...prev, [name]: "" }));

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================
  // Validation
  // =========================
  const validate = () => {
    const newErrors = {};

    if (!form.username.trim()) newErrors.username = "Username is required";
    if (!form.firstname.trim()) newErrors.firstname = "First name is required";
    if (!form.lastname.trim()) newErrors.lastname = "Last name is required";

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!form.agree) {
      newErrors.agree = "You must agree before registering";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // Submit
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      setServerError("");

      await api.post("/user/register", {
        username: form.username,
        firstname: form.firstname,
        lastname: form.lastname,
        email: form.email,
        password: form.password,
      });

      // Backend does NOT return token on register
      navigate("/login", { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Registration failed. Try again.";

      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // JSX
  // =========================
  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Join the network</h2>

        <p className="top-link">
          Already have an account?{" "}
          <Link className="signin-link" to="/login">
            Sign in
          </Link>
        </p>

        {serverError && <div className="server-error">{serverError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
            />
            {errors.username && (
              <small className="error">{errors.username}</small>
            )}
          </div>

          <div className="name-row">
            <div className="field">
              <input
                type="text"
                name="firstname"
                placeholder="First name"
                value={form.firstname}
                onChange={handleChange}
              />
              {errors.firstname && (
                <small className="error">{errors.firstname}</small>
              )}
            </div>

            <div className="field">
              <input
                type="text"
                name="lastname"
                placeholder="Last name"
                value={form.lastname}
                onChange={handleChange}
              />
              {errors.lastname && (
                <small className="error">{errors.lastname}</small>
              )}
            </div>
          </div>

          <div className="field">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <small className="error">{errors.email}</small>}
          </div>

          {/* PASSWORD FIELD */}
          <div className="field password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
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

          <div className="terms">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
            />
            <span>
              I agree to the <a href="#">privacy policy</a> and{" "}
              <a href="#">terms of service</a>.
            </span>
          </div>

          {errors.agree && <small className="error">{errors.agree}</small>}

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Agree and Join"}
          </button>
        </form>

        <p className="bottom-link">
          Already have an account?{" "}
          <Link className="signin-link" to="/login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
