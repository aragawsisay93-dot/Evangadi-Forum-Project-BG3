import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setServerError("");

    if (!email.trim()) {
      setServerError("Email is required");
      return;
    }

    try {
      setLoading(true);

      // Backend should send reset link to email (recommended)
      const res = await api.post("/user/forgot-password", {
        email: email.trim(),
      });

      setMsg(res?.data?.msg || "If this email exists, a reset link was sent.");
    } catch (err) {
      setServerError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fp-container">
      <div className="fp-box">
        <h2>Forgot Password</h2>
        <p className="fp-sub">
          Enter your email and we’ll send you a password reset link.
        </p>

        {serverError && <div className="server-error">{serverError}</div>}
        {msg && <div className="success-msg">{msg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p className="fp-back">
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
