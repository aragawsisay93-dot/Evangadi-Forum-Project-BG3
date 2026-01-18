// src/pages/QuestionDetails.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./QuestionDetails.css";

export default function QuestionDetails() {
  const { questionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const isAskPage = useMemo(() => {
    const p = location.pathname.toLowerCase();
    return p.endsWith("/ask") || questionId === "ask";
  }, [location.pathname, questionId]);

  // ===========================
  // Auth: current user id (best effort)
  // ===========================
  const currentUserId = useMemo(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "null");
      if (u?.userid) return Number(u.userid);
    } catch {}
    const id = localStorage.getItem("userid");
    return id ? Number(id) : null;
  }, []);

  const pickMsg = (err, fallback) =>
    err?.response?.data?.message ||
    err?.response?.data?.msg ||
    err?.response?.data?.error ||
    fallback;

  // ---------------------------
  // Ask Question state
  // ---------------------------
  const [qTitle, setQTitle] = useState("");
  const [qDetail, setQDetail] = useState("");
  const [qPosting, setQPosting] = useState(false);
  const [qError, setQError] = useState("");

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = (e) => {
    e.preventDefault();
    const newTag = tagInput.trim();
    if (!newTag) return;

    const normalized = newTag.toLowerCase();
    if (tags.includes(normalized)) {
      setTagInput("");
      return;
    }
    setTags((prev) => [...prev, normalized]);
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  // ---------------------------
  // Answer page state
  // ---------------------------
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [answerText, setAnswerText] = useState("");

  const [loading, setLoading] = useState(!isAskPage);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  // ===========================
  // UI state: edit/like/comment
  // ===========================
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editText, setEditText] = useState("");

  const [commentText, setCommentText] = useState({}); // { [answerid]: "text" }
  const [openComments, setOpenComments] = useState({}); // { [answerid]: true/false }

  // ===========================
  // Load question + answers
  // ===========================
  const load = async () => {
    if (isAskPage) return;
    if (!questionId || questionId === "ask") return;

    try {
      setError("");
      setLoading(true);

      const [qRes, aRes] = await Promise.all([
        api.get(`/questions/${questionId}`),
        api.get(`/answers/${questionId}`), // ✅ backend: GET /api/answers/:questionId
      ]);

      setQuestion(qRes.data);
      setAnswers(Array.isArray(aRes.data) ? aRes.data : []);
    } catch (err) {
      setError(pickMsg(err, "Failed to load question."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId, isAskPage]);

  // ---------------------------
  // Submit Ask Question
  // ---------------------------
  const submitQuestion = async (e) => {
    e.preventDefault();

    const title = qTitle.trim();
    const detail = qDetail.trim();

    if (!title || !detail) {
      setQError("Please enter both title and question detail.");
      return;
    }

    try {
      setQPosting(true);
      setQError("");

      await api.post("/questions", {
        title,
        description: detail,
        tags,
      });

      setQTitle("");
      setQDetail("");
      setTags([]);
      setTagInput("");
      navigate("/", { replace: true });
    } catch (err) {
      setQError(pickMsg(err, "Failed to post question."));
    } finally {
      setQPosting(false);
    }
  };

  // ---------------------------
  // Submit Answer  ✅ FIXED ROUTE HERE
  // ---------------------------
  const submitAnswer = async (e) => {
    e.preventDefault();
    const text = answerText.trim();
    if (!text) return;

    try {
      setPosting(true);
      setError("");

      // ✅ backend: POST /api/answers/:questionId
      await api.post(`/answers/${questionId}`, { answer: text });

      setAnswerText("");
      await load();
    } catch (err) {
      setError(pickMsg(err, "Failed to post answer."));
    } finally {
      setPosting(false);
    }
  };

  // ===========================
  // Edit answer
  // ===========================
  const startEdit = (answer) => {
    setEditingAnswerId(answer.answerid);
    setEditText(answer.answer || "");
  };

  const cancelEdit = () => {
    setEditingAnswerId(null);
    setEditText("");
  };

  const saveEdit = async (answerid) => {
    const text = editText.trim();
    if (!text) return;

    try {
      setError("");
      // ✅ backend: PUT /api/answers/:answerId
      await api.put(`/answers/${answerid}`, { answer: text });
      setEditingAnswerId(null);
      setEditText("");
      await load();
    } catch (err) {
      setError(pickMsg(err, "Failed to update answer."));
    }
  };

  // ===========================
  // Delete answer
  // ===========================
  const deleteAnswer = async (answerid) => {
    if (!window.confirm("Delete this answer?")) return;

    try {
      setError("");
      // ✅ backend: DELETE /api/answers/:answerId
      await api.delete(`/answers/${answerid}`);
      await load();
    } catch (err) {
      setError(pickMsg(err, "Failed to delete answer."));
    }
  };

  // ===========================
  // Like / Dislike
  // ===========================
  const reactAnswer = async (answerid, type) => {
    try {
      // ✅ backend: POST /api/answers/:answerId/react
      await api.post(`/answers/${answerid}/react`, { type });
      await load();
    } catch (err) {
      setError(pickMsg(err, "Failed to react."));
    }
  };

  // ===========================
  // Comments
  // ===========================
  const toggleComments = async (answerid) => {
    const willOpen = !openComments[answerid];
    setOpenComments((p) => ({ ...p, [answerid]: willOpen }));

    if (willOpen) {
      try {
        // ✅ backend: GET /api/answers/:answerId/comments
        const res = await api.get(`/answers/${answerid}/comments`);
        setAnswers((prev) =>
          prev.map((a) =>
            a.answerid === answerid ? { ...a, comments: res.data || [] } : a
          )
        );
      } catch (err) {
        setError(pickMsg(err, "Failed to load comments."));
      }
    }
  };

  const addComment = async (answerid) => {
    const text = (commentText[answerid] || "").trim();
    if (!text) return;

    try {
      // ✅ backend: POST /api/answers/:answerId/comments
      await api.post(`/answers/${answerid}/comments`, { comment: text });

      setCommentText((p) => ({ ...p, [answerid]: "" }));

      // refresh answers + counts
      await load();

      // fetch fresh comments again (so UI shows immediately)
      const res = await api.get(`/answers/${answerid}/comments`);
      setAnswers((prev) =>
        prev.map((a) =>
          a.answerid === answerid ? { ...a, comments: res.data || [] } : a
        )
      );
      setOpenComments((p) => ({ ...p, [answerid]: true }));
    } catch (err) {
      setError(pickMsg(err, "Failed to add comment."));
    }
  };

  // ===========================
  // ASK QUESTION PAGE UI
  // ===========================
  if (isAskPage) {
    return (
      <div className="qd-page">
        <div className="qd-wrap">
          <div className="qd-card">
            <h2 className="aq-steps-title">Steps To Write A Good Question.</h2>
            <div className="aq-steps-underline" />

            <ul className="aq-steps">
              <li>Summarize your problem in a one-line-title.</li>
              <li>Describe your problem in more detail.</li>
              <li>Describe what you tried and what you expected to happen.</li>
              <li>Review your question and post it here.</li>
            </ul>

            <h3 className="aq-form-title">Post Your Question</h3>

            {qError ? <p className="qd-error qd-error-inline">{qError}</p> : null}

            <form className="aq-form" onSubmit={submitQuestion}>
              <input
                className="aq-input"
                type="text"
                placeholder="Question title"
                value={qTitle}
                onChange={(e) => setQTitle(e.target.value)}
              />

              <textarea
                className="aq-textarea"
                placeholder="Question detail ..."
                rows={6}
                value={qDetail}
                onChange={(e) => setQDetail(e.target.value)}
              />

              <div className="aq-tags">
                <div className="aq-tags-list">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className="aq-tag-pill"
                      onClick={() => handleRemoveTag(tag)}
                      title="Click to remove"
                    >
                      {tag} <span className="aq-tag-x">×</span>
                    </button>
                  ))}
                </div>

                <input
                  className="aq-tag-input"
                  type="text"
                  placeholder="Add a tag and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddTag(e);
                  }}
                />
              </div>

              <button className="aq-btn" disabled={qPosting}>
                {qPosting ? "Posting..." : "Post Question"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ===========================
  // ANSWER PAGE UI
  // ===========================
  if (loading) return <p className="qd-loading">Loading...</p>;
  if (error) return <p className="qd-error">{error}</p>;
  if (!question) return <p className="qd-error">Question not found.</p>;

  return (
    <div className="qd-page">
      <div className="qd-wrap">
        <button className="qd-back" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="qd-question">
          <div className="qd-question-label">QUESTION</div>

          <div className="qd-tag-row">
            <span className="qd-blue-dot" />
            <span className="qd-tag">{question.tag || "General"}</span>
          </div>
          <div className="qd-orange-underline" />

          <h2 className="qd-title">{question.title}</h2>
        </div>

        <div className="qd-divider" />

        <h3 className="qd-answer-title">Answer From The Community</h3>

        <div className="qd-answers">
          {answers.length === 0 ? (
            <p className="qd-empty">No answers yet. Be the first!</p>
          ) : (
            answers.map((a) => {
              const key = a.answerid ?? `${a.userid}-${a.created_at}`;
              const isOwner =
                currentUserId != null &&
                Number(a.userid) === Number(currentUserId);

              return (
                <div key={key} className="qd-answer-item">
                  <div className="qd-avatar" aria-hidden="true">
                    <span className="qd-avatar-icon">👤</span>
                  </div>

                  <div className="qd-answer-body">
                    {/* EDIT MODE */}
                    {editingAnswerId === a.answerid ? (
                      <>
                        <textarea
                          className="qd-textarea"
                          rows={4}
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                        />
                        <div className="qd-action-row">
                          <button
                            type="button"
                            className="qd-mini-btn"
                            onClick={() => saveEdit(a.answerid)}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="qd-mini-btn ghost"
                            onClick={cancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="qd-answer-text">{a.answer}</p>

                        <div className="qd-answer-meta">
                          {a.username ?? `user #${a.userid}`}
                        </div>

                        {/* Like / Dislike / Comment / Counts */}
                        <div className="qd-react-row">
                          <button
                            type="button"
                            className="qd-react-btn"
                            onClick={() => reactAnswer(a.answerid, "like")}
                          >
                            👍 <span className="qd-count">{a.likeCount ?? 0}</span>
                          </button>

                          <button
                            type="button"
                            className="qd-react-btn"
                            onClick={() => reactAnswer(a.answerid, "dislike")}
                          >
                            👎{" "}
                            <span className="qd-count">{a.dislikeCount ?? 0}</span>
                          </button>

                          <button
                            type="button"
                            className="qd-react-btn"
                            onClick={() => toggleComments(a.answerid)}
                          >
                            💬{" "}
                            <span className="qd-count">{a.commentCount ?? 0}</span>
                          </button>

                          {/* Owner actions */}
                          {isOwner && (
                            <div className="qd-owner-actions">
                              <button
                                type="button"
                                className="qd-mini-btn"
                                onClick={() => startEdit(a)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="qd-mini-btn danger"
                                onClick={() => deleteAnswer(a.answerid)}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Comments section */}
                        {openComments[a.answerid] && (
                          <div className="qd-comments">
                            <div className="qd-comments-list">
                              {(a.comments || []).length === 0 ? (
                                <p className="qd-comments-empty">No comments yet.</p>
                              ) : (
                                (a.comments || []).map((c) => (
                                  <div
                                    key={c.commentid ?? c.created_at}
                                    className="qd-comment"
                                  >
                                    <div className="qd-comment-user">
                                      {c.username ?? `user #${c.userid}`}
                                    </div>
                                    <div className="qd-comment-text">{c.comment}</div>
                                  </div>
                                ))
                              )}
                            </div>

                            <div className="qd-comment-form">
                              <input
                                className="qd-comment-input"
                                placeholder="Write a comment..."
                                value={commentText[a.answerid] || ""}
                                onChange={(e) =>
                                  setCommentText((p) => ({
                                    ...p,
                                    [a.answerid]: e.target.value,
                                  }))
                                }
                              />
                              <button
                                type="button"
                                className="qd-mini-btn"
                                onClick={() => addComment(a.answerid)}
                              >
                                Send
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <form className="qd-form" onSubmit={submitAnswer}>
          <textarea
            className="qd-textarea"
            rows={6}
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Your answer..."
          />
          <button className="qd-btn" disabled={posting}>
            {posting ? "Posting..." : "Post Answer"}
          </button>
        </form>
      </div>
    </div>
  );
}
