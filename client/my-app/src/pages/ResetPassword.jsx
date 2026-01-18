import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../services/api";
import "./ResetPassword.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const token = useMemo(() => params.get("token"), [params]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);

  const [serverError, setServerError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!token) return "Reset token is missing.";
    if (!password) return "New password is required.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (password !== confirm) return "Passwords do not match.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setMsg("");

    const errMsg = validate();
    if (errMsg) {
      setServerError(errMsg);
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/user/reset-password", {
        token,
        password,
      });

      setMsg(res?.data?.msg || "Password updated successfully.");
      setTimeout(() => navigate("/login", { replace: true }), 700);
    } catch (err) {
      setServerError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Reset failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rp-container">
      <div className="rp-box">
        <h2>Reset Password</h2>

        {!token && (
          <div className="server-error">
            Reset token is missing. Please use the link from your email.
          </div>
        )}

        {serverError && <div className="server-error">{serverError}</div>}
        {msg && <div className="success-msg">{msg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field password-field">
            <input
              type={show ? "text" : "password"}
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShow((p) => !p)}
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="field">
            <input
              type={show ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <button
            className="login-btn"
            type="submit"
            disabled={loading || !token}
          >
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>

        <p className="rp-back">
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

