import { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { PhotoGrid } from "./components/photo-grid";
import { Bookmarks } from "./components/bookmark";
// import { Feeds } from "./components/feeds";
import { Wantlist } from "./components/wantlist";
// import { Chats } from "./components/chats";
import { PhotoDetail } from "./components/photo-detail";
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

  // Photos
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // useEffect(() => {
  //   fetch("/photos.json")
  //     .then((response) => response.json())
  //     .then((data) => { setPhotos(data.photos) })
  //     // only in case that path is wrong or file is missing
  //     .catch((err) => { console.error("Error fetching photos:", err) });
  // }, []);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch("https://pkzsg07jof.execute-api.eu-central-1.amazonaws.com/dev");
        if (!response.ok) {
          throw new Error(`Failed to fetch photos: ${response.statusText}`);
        }
        const data = await response.json();
        setPhotos(data.photos);
      } catch (err) {
        console.error("Error fetching photos from AWS API:", err);
      }
    };

    fetchPhotos();
  }, []);

  const renderCurrentView = () => {
    if (currentView === "photos") {
      return (
        <>
          <PhotoGrid
            photos={photos}
            columns={columnsCount}
            onPhotoClick={setSelectedPhoto}
          />
          {selectedPhoto && (
            <PhotoDetail photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
          )}
        </>
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
              // aria-label="Adjust number of columns"
              />
              <span className="grid-icon">+</span>
            </div>
          )}
        </div>

        <div className="theme-controls">
          <button
            className="theme-toggle"
            // aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
            onClick={toggleDarkMode}
          >
            {isDarkMode ? <FaMoon size="0.8em" /> : <FaSun />}
          </button>
        </div>
      </header>

      <main>{renderCurrentView()}</main>
    </div>
  )
}

export default App
