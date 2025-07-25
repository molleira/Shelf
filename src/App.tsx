import { useEffect, useState } from 'react'
import { Bookmarks } from './components/bookmark'
import { PasswordPrompt } from './components/password-prompt'
import { PhotoDetail } from './components/photo-detail'
import { PhotoGrid } from './components/photo-grid'
import type { Photo } from './types'
import { photos } from './mocks'
import './css/app.css'

function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  const [currentView, setCurrentView] = useState<"photos" | "bookmarks" | "feeds">("photos")

  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [columnsCount, setColumnsCount] = useState<number>(3)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [showPasswordPrompt, setShowPasswordPrompt] = useState<boolean>(false)

  // Simple password - in a real app, this would be more secure
  const PASSWORD = "portfolio2024"

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

  const handlePhotoClick = (photo: Photo) => {
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

  const handlePasswordSubmit = (password: string) => {
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
    const handleKeyDown = (e: KeyboardEvent) => {
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
  const visiblePhotos = photos.filter(photo => !photo.protected || isAuthenticated)

  const renderCurrentView = () => {
    switch (currentView) {
      case "photos":
        return <PhotoGrid photos={visiblePhotos} onPhotoClick={handlePhotoClick} columns={columnsCount} />
      case "bookmarks":
        return <Bookmarks />
        return null
      case "feeds":
        // return <Feeds />
        return null
      default:
        return <PhotoGrid photos={visiblePhotos} onPhotoClick={handlePhotoClick} columns={columnsCount} />
    }
  }

  // console.log(isDarkMode)

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
          <button
            className={`nav-button ${currentView === "feeds" ? "active" : ""}`}
            onClick={() => setCurrentView("feeds")}
          >
            Feeds
          </button>
        </nav>

        <div className="controls-group">
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
          
          {currentView === "photos" && (
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

      <main>
        {renderCurrentView()}
      </main>

      {selectedPhoto && !showPasswordPrompt && (
        <PhotoDetail photo={selectedPhoto} onClose={closeDetail} />
      )}

      {showPasswordPrompt && (
        <PasswordPrompt onSubmit={handlePasswordSubmit} onClose={closePasswordPrompt} />
      )}
    </div>
  )
}

export default App
