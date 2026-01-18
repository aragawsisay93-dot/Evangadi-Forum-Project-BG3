// src/components/Header/Header.jsx
import { Link, NavLink } from "react-router-dom";
import logo from "../../asset/Images/10001.png";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

export default function Header() {
  const { isAuthed, logout } = useAuth();

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
            <button type="button" onClick={() => logout(true)} className="nav-btn">
              LOG OUT
            </button>
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
