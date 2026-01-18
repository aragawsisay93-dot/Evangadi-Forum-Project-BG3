import { Link } from "react-router-dom";
import logo from "../../asset/Images/10002.png";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* LEFT */}
        <div className="footer-left">
          <Link to="/" className="footer-logo">
            <img src={logo} alt="Evangadi Logo" />
          </Link>

          <div className="footer-socials">
            <a href="#" aria-label="Facebook" className="social-icon">
              <svg viewBox="0 0 24 24">
                <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9v-2.9h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.3 0-1.7.8-1.7 1.6v1.9h2.9l-.5 2.9h-2.4v7A10 10 0 0 0 22 12z" />
              </svg>
            </a>

            <a href="#" aria-label="LinkedIn" className="social-icon">
              <svg viewBox="0 0 24 24">
                <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-.9 1.8-1.8 3.6-1.8 3.9 0 4.6 2.5 4.6 5.7V21h-4v-5.3c0-1.3 0-3-1.9-3s-2.2 1.4-2.2 2.9V21H9z" />
              </svg>
            </a>

            <a href="#" aria-label="YouTube" className="social-icon">
              <svg viewBox="0 0 24 24">
                <path d="M23.5 6.2s-.2-1.7-.9-2.4c-.8-.9-1.7-.9-2.1-1C16.7 2.5 12 2.5 12 2.5h0s-4.7 0-8.5.3c-.4.1-1.3.1-2.1 1C.7 4.5.5 6.2.5 6.2S0 8.1 0 10v1.9c0 1.9.5 3.8.5 3.8s.2 1.7.9 2.4c.8.9 1.9.8 2.4.9 1.7.2 7.2.3 8.2.3 0 0 4.7 0 8.5-.3.4-.1 1.3-.1 2.1-1 .7-.7.9-2.4.9-2.4s.5-1.9.5-3.8V10c0-1.9-.5-3.8-.5-3.8zM9.5 14.5V7.5l6 3.5-6 3.5z" />
              </svg>
            </a>
          </div>
        </div>

        {/* MIDDLE */}
        <div className="footer-middle">
          <h4>Useful Links</h4>
          <p>Home</p>
          <p>How it works</p>
          <p>Terms of Service</p>
          <p>Privacy Policy</p>
        </div>

        {/* RIGHT */}
        <div className="footer-right">
          <h4>Contact Info</h4>
          <p>Bethesda, MD</p>
          <p>Email: info@evangadi.com</p>
        </div>
      </div>
    </footer>
  );
}
