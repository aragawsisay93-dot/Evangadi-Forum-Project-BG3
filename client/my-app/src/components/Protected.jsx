// src/components/Protected.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Protected({ children }) {
  const { isAuthed, checking } = useAuth();

  if (checking) return <div style={{ padding: 20 }}>Checking login...</div>;
  if (!isAuthed) return <Navigate to="/login" replace />;

  return children;
}
