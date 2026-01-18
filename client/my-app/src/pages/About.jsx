import { Outlet, useNavigate } from "react-router-dom";
import "./About.css";
import bg from "../asset/Images/10003.svg";

export default function AboutLayout() {
  const navigate = useNavigate();

  return (
    <main className="about-container">
      <img className="about-bg" src={bg} alt="" aria-hidden="true" />

      <section className="about-content">
        <div className="left-panel">
          <Outlet />
        </div>

        <div className="about-text">
          <span className="section-label">About</span>
          <h1>Evangadi Networks</h1>

          <p>
            No matter what stage of life you are in, whether you are just
            starting elementary school or have recently retired, coding is fun.
          </p>
          <p>
            However, learning to code can be a very challenging process. We
            believe that communities are the best way to learn and grow.
          </p>

          <button className="how-btn" onClick={() => navigate("/about")}>
            HOW IT WORKS
          </button>
        </div>
      </section>
    </main>
  );
}
