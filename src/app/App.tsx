import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";
import { Marcadors } from "../marcadors/marcadors";
import { Canals } from "../canals/canals";
import { Filosofia } from "../filosofia/filosofia";
import "./app.css";

function App() {
  const [esModeOscur, canviarEsModeOscur] = useState(false);
  const alternarModeOscur = () => canviarEsModeOscur(!esModeOscur);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark-mode", esModeOscur);
  }, [esModeOscur]);

  return (
    <div className="container">
      <header>
        <nav className="nav">
          <Link
            to="/marcadors"
            className={`nav-item ${location.pathname === "/" || location.pathname === "/marcadors" ? "active" : ""}`}
          >
            Marcadors
          </Link>
          <Link
            to="/canals"
            className={`nav-item ${location.pathname === "/canals" ? "active" : ""
              }`}
          >
            Fonts
          </Link>
          <Link
            to="/filosofia"
            className={`nav-item ${location.pathname === "/filosofia" ? "active" : ""
              }`}
          >
            Filosofia
          </Link>
        </nav>

        <div>
          <button className="theme-toggle" onClick={alternarModeOscur}>
            {esModeOscur ? <FaMoon size="0.8em" /> : <FaSun />}
          </button>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Marcadors />} />
          <Route path="/marcadors" element={<Marcadors />} />
          <Route path="/canals" element={<Canals />} />
          <Route path="/filosofia" element={<Filosofia />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
