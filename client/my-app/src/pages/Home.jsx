
// // src/pages/Home.jsx
// import { useEffect, useMemo, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import api from "../services/api";
// import "./Home.css";

// export default function Home() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { auth } = useAuth();

//   // ✅ user for Welcome (AuthContext first, then localStorage fallback)
//   const user = useMemo(() => {
//     if (auth?.user) return auth.user;
//     try {
//       return JSON.parse(localStorage.getItem("user") || "null");
//     } catch {
//       return null;
//     }
//   }, [auth?.user]);

//   const [questions, setQuestions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // ✅ read search query from URL (?q=...)
//   const qFromUrl = useMemo(() => {
//     const params = new URLSearchParams(location.search);
//     return (params.get("q") || "").trim();
//   }, [location.search]);

//   const [searchText, setSearchText] = useState("");

//   // sync input when URL changes
//   useEffect(() => {
//     setSearchText(qFromUrl);
//   }, [qFromUrl]);

//   const pickMsg = (err, fallback) =>
//     err?.response?.data?.message ||
//     err?.response?.data?.msg ||
//     err?.response?.data?.error ||
//     fallback;

//   // ✅ Build full URL for avatar if backend returns "/uploads/..."
//   const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5500";
//   const toAvatarUrl = (avatarUrl) => {
//     if (!avatarUrl) return "/default-avatar.png"; // from public/
//     if (avatarUrl.startsWith("http")) return avatarUrl;
//     return `${BASE_URL}${avatarUrl}`; // e.g. http://localhost:5500/uploads/avatars/xxx.png
//   };

//   // ✅ fetch questions (all or search)
//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const res = qFromUrl
//           ? await api.get(`/questions/search?q=${encodeURIComponent(qFromUrl)}`)
//           : await api.get("/questions");

//         setQuestions(Array.isArray(res.data) ? res.data : []);
//       } catch (err) {
//         setError(pickMsg(err, "Failed to load questions."));
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuestions();
//   }, [qFromUrl]);

//   // ✅ submit search -> update URL (?q=...)
//   const submitSearch = (e) => {
//     e.preventDefault();
//     const term = searchText.trim();

//     if (!term) {
//       navigate("/", { replace: true });
//       return;
//     }

//     navigate(`/?q=${encodeURIComponent(term)}`);
//   };

//   // ✅ clear search
//   const clearSearch = () => {
//     setSearchText("");
//     navigate("/", { replace: true });
//   };

//   if (loading) return <p className="home-loading">Loading...</p>;
//   if (error) return <p className="home-error">{error}</p>;

//   return (
//     <div className="home">
//       {/* ✅ Welcome centered on top */}
//       {user && (
//         <div className="welcome-top">
//           Welcome: <span>{user.username || user.firstname || "User"}</span>
//         </div>
//       )}

//       <div className="home-header">
//         <button className="ask-btn" onClick={() => navigate("/questions/ask")}>
//           Ask Question
//         </button>

//         <form className="home-search-form" onSubmit={submitSearch}>
//           <input
//             className="home-search"
//             placeholder="search question"
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//           />

//           <button type="submit" className="home-search-btn">
//             Search
//           </button>

//           {qFromUrl && (
//             <button
//               type="button"
//               className="home-search-btn ghost"
//               onClick={clearSearch}
//               title="Clear search"
//             >
//               Clear
//             </button>
//           )}
//         </form>
//       </div>

//       {qFromUrl ? (
//         <p className="home-search-label">
//           Showing results for: <b>{qFromUrl}</b>
//         </p>
//       ) : null}

//       {questions.length === 0 ? (
//         <p>No questions found.</p>
//       ) : (
//         <ul className="question-list">
//           {questions.map((q) => (
//             <li
//               key={q.questionid}
//               className="question-item"
//               onClick={() => navigate(`/questions/${q.questionid}`)}
//               role="button"
//               tabIndex={0}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") navigate(`/questions/${q.questionid}`);
//               }}
//             >
//               <div className="question-left">
//                 {/* ✅ Responsive profile picture */}
//                 <div className="avatar-wrap">
//                   <img
//                     className="avatar-img"
//                     src={toAvatarUrl(q.avatar_url)}
//                     alt={`${q.username || "User"} avatar`}
//                     loading="lazy"
//                     onError={(e) => {
//                       e.currentTarget.src = "/default-avatar.png";
//                     }}
//                   />
//                 </div>

//                 <div>
//                   <div className="question-title">{q.title}</div>
//                   <div className="question-user">
//                     {q.username ?? `user #${q.userid}`}
//                   </div>
//                 </div>
//               </div>

//               <div className="question-arrow">›</div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
// src/pages/Home.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { toAvatarUrl } from "../utils/avatar"; // ✅ use shared helper
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();

  // ✅ user for Welcome (AuthContext first, then localStorage fallback)
  const user = useMemo(() => {
    if (auth?.user) return auth.user;
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, [auth?.user]);

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ read search query from URL (?q=...)
  const qFromUrl = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get("q") || "").trim();
  }, [location.search]);

  const [searchText, setSearchText] = useState("");

  // sync input when URL changes
  useEffect(() => {
    setSearchText(qFromUrl);
  }, [qFromUrl]);

  const pickMsg = (err, fallback) =>
    err?.response?.data?.message ||
    err?.response?.data?.msg ||
    err?.response?.data?.error ||
    fallback;

  // ✅ fetch questions (all or search)
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError("");

        const res = qFromUrl
          ? await api.get(`/questions/search?q=${encodeURIComponent(qFromUrl)}`)
          : await api.get("/questions");

        setQuestions(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError(pickMsg(err, "Failed to load questions."));
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [qFromUrl]);

  // ✅ submit search -> update URL (?q=...)
  const submitSearch = (e) => {
    e.preventDefault();
    const term = searchText.trim();

    if (!term) {
      navigate("/", { replace: true });
      return;
    }

    navigate(`/?q=${encodeURIComponent(term)}`);
  };

  // ✅ clear search
  const clearSearch = () => {
    setSearchText("");
    navigate("/", { replace: true });
  };

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

      <div className="home-header">
        <button className="ask-btn" onClick={() => navigate("/questions/ask")}>
          Ask Question
        </button>

        <form className="home-search-form" onSubmit={submitSearch}>
          <input
            className="home-search"
            placeholder="search question"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <button type="submit" className="home-search-btn">
            Search
          </button>

          {qFromUrl && (
            <button
              type="button"
              className="home-search-btn ghost"
              onClick={clearSearch}
              title="Clear search"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {qFromUrl ? (
        <p className="home-search-label">
          Showing results for: <b>{qFromUrl}</b>
        </p>
      ) : null}

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
                {/* ✅ Responsive profile picture */}
                <div className="avatar-wrap">
                  <img
                    className="avatar-img"
                    src={toAvatarUrl(q.avatar_url)}
                    alt={`${q.username || "User"} avatar`}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "/default-avatar.png";
                    }}
                  />
                </div>

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
