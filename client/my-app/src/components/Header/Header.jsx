
// // src/components/Header/Header.jsx
// import { Link, NavLink } from "react-router-dom";
// import logo from "../../asset/Images/10001.png";
// import { useAuth } from "../../context/AuthContext";
// import { toAvatarUrl } from "../../utils/avatar"; // ✅ add this
// import "./Header.css";

// export default function Header() {
//   const { isAuthed, auth, logout } = useAuth(); // ✅ include auth

//   const user = auth?.user;

//   return (
//     <header className="header">
//       <div className="header-inner">
//         <Link to="/" className="logo" aria-label="Evangadi Home">
//           <img src={logo} alt="Evangadi" />
//         </Link>

//         <nav className="nav" aria-label="Primary navigation">
//           <NavLink to="/" end className="nav-link">
//             Home
//           </NavLink>

//           <NavLink to="/about" className="nav-link">
//             How it works
//           </NavLink>

//           {isAuthed ? (
//             <div className="nav-auth">
//               {/* ✅ Avatar → Profile page */}
//               <Link to="/profile" className="nav-avatar" title="Profile">
//                 <img
//                   src={toAvatarUrl(user?.avatar_url)}
//                   alt="profile"
//                   onError={(e) => {
//                     e.currentTarget.src = "/default-avatar.png";
//                   }}
//                 />
//               </Link>

//               <button
//                 type="button"
//                 onClick={() => logout(true)}
//                 className="nav-btn"
//               >
//                 LOG OUT
//               </button>
//             </div>
//           ) : (
//             <Link to="/login" className="nav-btn">
//               SIGN IN
//             </Link>
//           )}
//         </nav>
//       </div>
//     </header>
//   );
// }
// src/components/Header/Header.jsx
import { Link, NavLink } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import logo from "../../asset/Images/10001.png";
import { useAuth } from "../../context/AuthContext";
import { toAvatarUrl } from "../../utils/avatar";
import "./Header.css";

export default function Header() {
  const { isAuthed, auth, logout } = useAuth();

  // ✅ localStorage fallback (so avatar stays after refresh)
  const [lsUser, setLsUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  // ✅ update when localStorage changes (same tab too if you dispatch Event("storage"))
  useEffect(() => {
    const onStorage = () => {
      try {
        setLsUser(JSON.parse(localStorage.getItem("user") || "null"));
      } catch {
        setLsUser(null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // ✅ choose user: AuthContext first, else localStorage
  const user = useMemo(() => auth?.user || lsUser, [auth?.user, lsUser]);

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo" aria-label="Evangadi Home">
          <img src={logo} alt="Evangadi" />
        </Link>

        <nav className="nav" aria-label="Primary navigation">
          <NavLink to="/" end className="nav-link">
            Home
          </NavLink>

          <NavLink to="/about" className="nav-link">
            How it works
          </NavLink>

          {isAuthed ? (
            <div className="nav-auth">
              {/* ✅ Avatar → Profile page */}
              <Link to="/profile" className="nav-avatar" title="Profile">
                <img
                  src={toAvatarUrl(user?.avatar_url)}
                  alt="profile"
                  onError={(e) => {
                    e.currentTarget.src = "/default-avatar.png";
                  }}
                />
              </Link>

              <button
                type="button"
                onClick={() => logout(true)}
                className="nav-btn"
              >
                LOG OUT
              </button>
            </div>
          ) : (
            <Link to="/login" className="nav-btn">
              SIGN IN
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
