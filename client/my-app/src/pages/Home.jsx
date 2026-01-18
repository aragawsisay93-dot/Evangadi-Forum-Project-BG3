import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const user = auth?.user;

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setError("");
        const res = await api.get("/questions");
        setQuestions(res.data);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Failed to load questions."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) return <p className="home-loading">Loading...</p>;
  if (error) return <p className="home-error">{error}</p>;

  return (
    <div className="home">
      {/* ✅ Welcome centered on top */}
      {user && (
        <div className="welcome-top">
          Welcome: <span>{user.username || user.firstname || "User"}</span>
        </div>
      )}

      {/* Ask + Search row */}
      <div className="home-header">
        <button className="ask-btn" onClick={() => navigate("/questions/ask")}>
          Ask Question
        </button>

        <input className="home-search" placeholder="search question" disabled />
      </div>

      {/* Question list */}
      {questions.length === 0 ? (
        <p>No questions found.</p>
      ) : (
        <ul className="question-list">
          {questions.map((q) => (
            <li
              key={q.questionid}
              className="question-item"
              onClick={() => navigate(`/questions/${q.questionid}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") navigate(`/questions/${q.questionid}`);
              }}
            >
              <div className="question-left">
                <div className="avatar">👤</div>
                <div>
                  <div className="question-title">{q.title}</div>
                  <div className="question-user">
                    {q.username ?? `user #${q.userid}`}
                  </div>
                </div>
              </div>

              <div className="question-arrow">›</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
