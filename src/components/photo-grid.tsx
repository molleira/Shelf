import { useEffect, useRef } from "react"
import type { Photo } from "../types"
import '../css/photo-grid.css'

interface PhotoGridProps {
  photos: Photo[]
  onPhotoClick: (photo: Photo) => void
  columns: number
}

export const PhotoGrid = ({ photos, onPhotoClick, columns }: PhotoGridProps) => {
  const gridRef = useRef<HTMLDivElement>(null)

  // Implement lazy loading for images
  useEffect(() => {
    if (!gridRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.removeAttribute("data-src")
            }
            observer.unobserve(img)
          }
        })
      },
      { rootMargin: "200px" },
    )

    const images = gridRef.current.querySelectorAll("img[data-src]")
    images.forEach((img) => observer.observe(img))

    return () => observer.disconnect()
  }, [photos])

  return (
    <div
      ref={gridRef}
      className="photo-grid"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="photo-item"
          onClick={() => onPhotoClick(photo)}
          role="button"
          tabIndex={0}
          aria-label={`View ${photo.alt || "photo"}`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onPhotoClick(photo)
            }
          }}
        >
          <img data-src={photo.src || "/placeholder.svg"} src="/placeholder.svg?height=100&width=100" alt={photo.alt} />
        </div>
      ))}
    </div>
  )
}
