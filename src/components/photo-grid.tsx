import { useState } from "react"
import type { Photo } from "../types"
import { PhotoDetail } from "./photo-detail"
import '../css/photo-grid.css'

interface PhotoGridProps {
  photos: Photo[]
  columns: number
}

export const PhotoGrid = ({ photos, columns }: PhotoGridProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <>
      <div
        className="photo-grid"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
      >

        {photos.map(photo => (
          <img
            key={photo.id}
            className="photo-item"
            src={photo.src}
            alt={photo.alt}
            onClick={() => setSelectedPhoto(photo)}
          />
        ))}
      </div>

      {selectedPhoto && <PhotoDetail photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />}
    </>

  )
}
