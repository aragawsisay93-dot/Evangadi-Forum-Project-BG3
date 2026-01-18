import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import AboutLayout from "./pages/About";
import Protected from "./components/Protected";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import HowItWorks from "./pages/HowItWorks";
import QuestionDetails from "./pages/QuestionDetails";

import "./App.css";

export default function App() {
  return (
    <Routes>
      {/* =========================
          Main layout (Header/Footer)
      ========================= */}
      <Route element={<Layout />}>
        {/* Public info page */}
        <Route path="/about" element={<HowItWorks />} />

        {/* =========================
            Auth-related pages
        ========================= */}
        <Route element={<AboutLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* =========================
            Protected pages
        ========================= */}
        <Route
          path="/"
          element={
            <Protected>
              <Home />
            </Protected>
          }
        />

        {/* Ask / Create Question */}
        <Route
          path="/questions/ask"
          element={
            <Protected>
              <QuestionDetails />
            </Protected>
          }
        />

        {/* Question details + answers */}
        <Route
          path="/questions/:questionId"
          element={
            <Protected>
              <QuestionDetails />
            </Protected>
          }
        />

        {/* =========================
            Fallback
        ========================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
