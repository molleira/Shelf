import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";
import { BookmarkPage } from "../bookmark/bookmark";
// import { FeedPage } from "../feed/feed";
import "./app.css";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  return (
    <div className="container">
      <header>
        <nav className="nav">
          <Link
            to="/bookmarks"
            className={`nav-item ${location.pathname === "/bookmarks" ? "active" : ""}`}
          >
            Bookmarks
          </Link>
          <Link
            to="/feeds"
            className={`nav-item ${location.pathname === "/feeds" ? "active" : ""}`}
          >
            Feeds
          </Link>
        </nav>

        <div>
          <button
            className="theme-toggle"
            onClick={toggleDarkMode}
          >
            {isDarkMode ? <FaMoon size="0.8em" /> : <FaSun />}

          </button>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<BookmarkPage />} />
          <Route path="/bookmarks" element={<BookmarkPage />} />
          <Route path="/feeds" element={<div>Feeds coming soon...</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
