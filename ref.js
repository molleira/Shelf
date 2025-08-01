// @ts-nocheck
import { useState, useEffect } from "react"
import PhotoGrid from "./components/PhotoGrid"
import PhotoDetail from "./components/PhotoDetail"
import Bookmarks from "./components/Bookmarks"
import Feeds from "./components/Feeds"
import Wantlist from "./components/Wantlist"
import Chats from "./components/Chats"
import PasswordPrompt from "./components/PasswordPrompt"
// import type { Photo } from "./types"
import "./App.css"

// Fallback photos in case the fetch fails
// const fallbackPhotos: Photo[] = [
  const fallbackPhotos = [

  {
    id: 1,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Mountain landscape",
    date: "April 15, 2023",
    location: "Yosemite National Park, CA",
    description: "Spring morning at Yosemite Valley",
    protected: false,
  },
  {
    id: 2,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Ocean sunset",
    date: "June 22, 2023",
    location: "Big Sur, CA",
    description: "Sunset over the Pacific",
    protected: true,
  },
]

function App() {
  // const [photos, setPhotos] = useState<Photo[]>([])
  const [photos, setPhotos] = useState([])
  const [photosLoading, setPhotosLoading] = useState(true)
  const [photosError, setPhotosError] = useState<string | null>(null)

  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [columnsCount, setColumnsCount] = useState<number>(3)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  const [currentView, setCurrentView] = useState<"photos" | "bookmarks" | "feeds" | "wantlist" | "chats">("photos")
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [showPasswordPrompt, setShowPasswordPrompt] = useState<boolean>(false)

  // Simple password - in a real app, this would be more secure
  const PASSWORD = "portfolio2024"

  // Fetch photos from JSON file
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        console.log("Fetching photos.json...")
        const response = await fetch("/photos.json")

        if (!response.ok) {
          throw new Error(`Failed to fetch photos.json: ${response.status} ${response.statusText}`)
        }

        const text = await response.text()
        console.log("Raw response:", text.substring(0, 100) + "...")

        if (!text.trim()) {
          throw new Error("Empty response received")
        }

        try {
          const data = JSON.parse(text)
          setPhotos(data.photos)
        } catch (parseError) {
          console.error("JSON parse error:", parseError)
          throw new Error(`Invalid JSON: ${parseError instanceof Error ? parseError.message : String(parseError)}`)
        }
      } catch (err) {
        console.error("Error fetching photos:", err)
        setPhotosError(`Failed to load photos: ${err instanceof Error ? err.message : String(err)}`)

        // Fallback to hardcoded data
        console.log("Using fallback photos")
        setPhotos(fallbackPhotos)
      } finally {
        setPhotosLoading(false)
      }
    }

    fetchPhotos()
  }, [])

  // Check system preference for dark mode on initial load
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    setIsDarkMode(prefersDark)
  }, [])

  // Apply dark mode class to document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark-mode")
    } else {
      document.documentElement.classList.remove("dark-mode")
    }
    if (isDarkMode) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev)
  }

  // const handlePhotoClick = (photo: Photo) => {
    const handlePhotoClick = (photo) => {

    if (photo.protected && !isAuthenticated) {
      setShowPasswordPrompt(true)
      setSelectedPhoto(photo)
    } else {
      setSelectedPhoto(photo)
    }
  }

  const closeDetail = () => {
    setSelectedPhoto(null)
  }

  // const handlePasswordSubmit = (password: string) => {
    const handlePasswordSubmit = (password) => {

    if (password === PASSWORD) {
      setIsAuthenticated(true)
      setShowPasswordPrompt(false)
    } else {
      alert("Incorrect password")
    }
  }

  const closePasswordPrompt = () => {
    setShowPasswordPrompt(false)
    setSelectedPhoto(null)
  }

  // Handle keyboard navigation
  useEffect(() => {
    // const handleKeyDown = (e: KeyboardEvent) => {
    const handleKeyDown = (e) => {

      if (selectedPhoto) {
        if (e.key === "Escape") {
          closeDetail()
        }
      }
      if (showPasswordPrompt && e.key === "Escape") {
        closePasswordPrompt()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedPhoto, showPasswordPrompt])

  // Filter photos based on authentication
  const visiblePhotos = photos.filter((photo) => !photo.protected || isAuthenticated)

  const renderCurrentView = () => {
    if (currentView === "photos") {
      if (photosLoading) {
        return <div className="loading-container">Loading photos...</div>
      }

      if (photosError && photos.length === 0) {
        return (
          <div className="error-container">
            <p>{photosError}</p>
            <p className="error-hint">Make sure photos.json exists in the public folder</p>
          </div>
        )
      }

      return <PhotoGrid photos={visiblePhotos} onPhotoClick={handlePhotoClick} columns={columnsCount} />
    }

    switch (currentView) {
      case "bookmarks":
        return <Bookmarks />
      case "feeds":
        return <Feeds />
      case "wantlist":
        return <Wantlist columns={columnsCount} />
      case "chats":
        return <Chats />
      default:
        return null
    }
  }

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

      {selectedPhoto && !showPasswordPrompt && <PhotoDetail photo={selectedPhoto} onClose={closeDetail} />}

      {showPasswordPrompt && <PasswordPrompt onSubmit={handlePasswordSubmit} onClose={closePasswordPrompt} />}
    </div>
  )
}

export default App
