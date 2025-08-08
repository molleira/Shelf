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
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const mode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(mode);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark-mode");
      document.body.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev)
  }

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
        <div className="theme-controls">
          <span className="theme-icon">Light</span>
          <input
            type="range"
            min="0"
            max="1"
            step="1"
            value={isDarkMode ? 1 : 0}
            onChange={() => toggleDarkMode()}
            className="theme-slider"
            aria-label="Toggle dark mode"
          />
          <span className="theme-icon">Dark</span>
        </div>

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
      </header>

      <main>{renderCurrentView()}</main>

      {selectedPhoto && !showPasswordPrompt && <PhotoDetail photo={selectedPhoto} onClose={closeOverlay} />}
      {showPasswordPrompt && <PasswordPrompt onSubmit={handlePasswordSubmit} onClose={closeOverlay} />}
    </div>
  )
}

export default App
