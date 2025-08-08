import { useState, useEffect } from "react";
import { PhotoGrid } from "./components/photo-grid";
import { PhotoDetail } from "./components/photo-detail";
import { Bookmarks } from "./components/bookmark";
// import { Feeds } from "./components/feeds";
import { Wantlist } from "./components/wantlist";
// import { Chats } from "./components/chats";
import { PasswordPrompt } from "./components/password-prompt";
import type { Photo } from "./types";
import "./css/app.css";

function App() {
  // Dark mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) return stored === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      if (localStorage.getItem("darkMode") === null) {
        setIsDarkMode(e.matches);
      }
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Columns and current view
  const [columnsCount, setColumnsCount] = useState<number>(3);
  const [currentView, setCurrentView] = useState<"photos" | "bookmarks" | "feeds" | "wantlist" | "chats">("photos");

  const renderCurrentView = () => {
    if (currentView === "photos") {
      return (
        <PhotoGrid
          photos={photos}
          onPhotoClick={handlePhotoClick}
          columns={columnsCount}
          isAuthenticated={isAuthenticated}
        />
      )
    }
    switch (currentView) {
      case "bookmarks":
        return <Bookmarks />
      // case "feeds":
      //   return <Feeds />
      case "wantlist":
        return <Wantlist columns={columnsCount} />
      // case "chats":
      //   return <Chats />
      default:
        return null
    }
  }

  // Photos
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    fetch("/photos.json")
      .then((response) => response.json())
      .then((data) => { setPhotos(data.photos) })
      // only in case that path is wrong or file is missing
      .catch((err) => { console.error("Error fetching photos:", err) });
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const handlePhotoClick = (photo: Photo) => {
    if (photo.protected && !isAuthenticated) {
      setShowPasswordPrompt(true);
      setSelectedPhoto(photo);
    } else {
      setSelectedPhoto(photo);
    };
  };

  const PASSWORD = "portfolio2024";

  const handlePasswordSubmit = (password: string) => {
    if (password === PASSWORD) {
      setIsAuthenticated(true)
      setShowPasswordPrompt(false)
    } else {
      alert("Incorrect password")
    }
  }

  const closeOverlay = () => {
    setShowPasswordPrompt(false);
    setSelectedPhoto(null);
  };

  return (
    <div className={`app ${isDarkMode ? "dark-mode" : ""}`}>
      <header>
        <nav className="nav-controls">
          <button
            className={`nav-button ${currentView === "photos" ? "active" : ""}`}
            onClick={() => setCurrentView("photos")}
          >
            Photos
          </button>
          <button
            className={`nav-button ${currentView === "bookmarks" ? "active" : ""}`}
            onClick={() => setCurrentView("bookmarks")}
          >
            Bookmarks
          </button>
          {/* <button
            className={`nav-button ${currentView === "feeds" ? "active" : ""}`}
            onClick={() => setCurrentView("feeds")}
          >
            Feeds
          </button> */}
          <button
            className={`nav-button ${currentView === "wantlist" ? "active" : ""}`}
            onClick={() => setCurrentView("wantlist")}
          >
            Wantlist
          </button>
          {/* <button
            className={`nav-button ${currentView === "chats" ? "active" : ""}`}
            onClick={() => setCurrentView("chats")}
          >
            Chats
          </button> */}
        </nav>

        <div className="controls-group">
          {(currentView === "photos" || currentView === "wantlist") && (
            <div className="grid-controls">
              <span className="grid-icon">−</span>
              <input
                type="range"
                min="2"
                max="6"
                value={columnsCount}
                onChange={(e) => setColumnsCount(Number.parseInt(e.target.value))}
                className="columns-slider"
                aria-label="Adjust number of columns"
              />
              <span className="grid-icon">+</span>
            </div>
          )}
        </div>

        <div className="theme-controls">
          <button
            className="theme-toggle"
            aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
            onClick={toggleDarkMode}
          >
            {isDarkMode ? "🌙" : "☀️"}
          </button>
        </div>
      </header>

      <main>{renderCurrentView()}</main>

      {selectedPhoto && !showPasswordPrompt && <PhotoDetail photo={selectedPhoto} onClose={closeOverlay} />}
      {showPasswordPrompt && <PasswordPrompt onSubmit={handlePasswordSubmit} onClose={closeOverlay} />}
    </div>
  )
}

export default App
