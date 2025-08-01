import { useState, useEffect, useCallback } from "react";
import { PhotoGrid } from "./components/photo-grid";
import { PhotoDetail } from "./components/photo-detail";
import { Bookmarks } from "./components/bookmark";
// import { Feeds } from "./components/feeds";
import { Wantlist } from "./components/wantlist";
// import { Chats } from "./components/chats";
import { PasswordPrompt } from "./components/password-prompt";
import type { Photo } from "./types";
import "./css/app.css";

// Fallback photos in case the fetch fails
// const fallbackPhotos: Photo[] = [
//   {
//     id: 1,
//     src: "/placeholder.svg?height=600&width=800",
//     alt: "Mountain landscape",
//     date: "April 15, 2023",
//     location: "Yosemite National Park, CA",
//     description: "Spring morning at Yosemite Valley",
//     protected: false,
//   },
//   {
//     id: 2,
//     src: "/placeholder.svg?height=600&width=800",
//     alt: "Ocean sunset",
//     date: "June 22, 2023",
//     location: "Big Sur, CA",
//     description: "Sunset over the Pacific",
//     protected: true,
//   },
// ]

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

  // const handleKeyDown = useCallback((e: KeyboardEvent) => {
  //   if ((selectedPhoto || showPasswordPrompt) && e.key === "Escape") {
  //     closeOverlay();
  //   }
  // }, [selectedPhoto, showPasswordPrompt]);

  // useEffect(() => {
  //   if (selectedPhoto || showPasswordPrompt) {
  //     window.addEventListener("keydown", handleKeyDown);
  //     return () => window.removeEventListener("keydown", handleKeyDown);
  //   }
  // }, [selectedPhoto, showPasswordPrompt, handleKeyDown]);

  // const closePasswordPrompt = () => {
  //   setShowPasswordPrompt(false)
  //   setSelectedPhoto(null)
  // }

  // const closeDetail = () => {
  //   setSelectedPhoto(null);
  // };

  // // Handle keyboard navigation
  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     if (selectedPhoto) {
  //       if (e.key === "Escape") {
  //         closeDetail()
  //       }
  //     }
  //     if (showPasswordPrompt && e.key === "Escape") {
  //       closePasswordPrompt()
  //     }
  //   }

  //   window.addEventListener("keydown", handleKeyDown)
  //   return () => window.removeEventListener("keydown", handleKeyDown)
  // }, [selectedPhoto, showPasswordPrompt])

  // const [photosLoading, setPhotosLoading] = useState(true);
  // const [photosError, setPhotosError] = useState<string | null>(null); 

  // useEffect(() => {
  //   const fetchPhotos = async () => {
  //     try {
  //       const response = await fetch("/photos.json");
  //       const data = await response.json();
  //       setPhotos(data.photos);
  //     } catch (err) {
  //       // handle error
  //     }
  //   };
  //   fetchPhotos();
  // }, []);

  // Fetch photos from JSON file
  // useEffect(() => {
  //   const fetchPhotos = async () => {
  //     try {
  //       // console.log("Fetching photos.json...")
  //       const response = await fetch("/photos.json");
  //       console.log('response', response);

  //       // if (!response.ok) {
  //       //   throw new Error(`Failed to fetch photos.json: ${response.status} ${response.statusText}`)
  //       // }

  //       const text = await response.text();
  //       console.log('text', text);
  //       // console.log("Raw response:", text.substring(0, 100) + "...")

  //       // if (!text.trim()) {
  //       //   throw new Error("Empty response received")
  //       // }

  //       try {
  //         const data = JSON.parse(text)
  //         setPhotos(data.photos)
  //       } catch (parseError) {
  //         console.error("JSON parse error:", parseError)
  //         throw new Error(`Invalid JSON: ${parseError instanceof Error ? parseError.message : String(parseError)}`)
  //       }
  //     } catch (err) {
  //       // console.error("Error fetching photos:", err)
  //       setPhotosError(`Failed to load photos: ${err instanceof Error ? err.message : String(err)}`)

  //       // Fallback to hardcoded data
  //       // console.log("Using fallback photos")
  //       // setPhotos(fallbackPhotos)
  //     } finally {
  //       setPhotosLoading(false)
  //     }
  //   }

  //   fetchPhotos()
  // }, [])

  // Filter photos based on authentication
  // const visiblePhotos = photos.filter((photo) => !photo.protected || isAuthenticated)

  // const renderCurrentView = () => {
  // if (currentView === "photos") {
  //   if (photosLoading) {
  //     return <div className="loading-container">Loading photos...</div>
  //   }

  //   if (photosError && photos.length === 0) {
  //     return (
  //       <div className="error-container">
  //         <p>{photosError}</p>
  //         <p className="error-hint">Make sure photos.json exists in the public folder</p>
  //       </div>
  //     )
  //   }

  //   return <PhotoGrid photos={visiblePhotos} onPhotoClick={handlePhotoClick} columns={columnsCount} />
  // }

  // return <PhotoGrid photos={visiblePhotos} onPhotoClick={handlePhotoClick} columns={columnsCount} isAuthenticated={isAuthenticated} />

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
          <button
            className={`nav-button ${currentView === "feeds" ? "active" : ""}`}
            onClick={() => setCurrentView("feeds")}
          >
            Feeds
          </button>
          <button
            className={`nav-button ${currentView === "wantlist" ? "active" : ""}`}
            onClick={() => setCurrentView("wantlist")}
          >
            Wantlist
          </button>
          <button
            className={`nav-button ${currentView === "chats" ? "active" : ""}`}
            onClick={() => setCurrentView("chats")}
          >
            Chats
          </button>
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
