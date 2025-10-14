// import type { Photo } from "../types"
// import { PhotoItem } from "./photo-item"
// import '../css/photo-grid.css'

// interface PhotoGridProps {
//   photos: Photo[]
//   columns: number
//   onPhotoClick: (photo: Photo) => void;
// }

// export const PhotoGrid = ({ photos, columns, onPhotoClick }: PhotoGridProps) => {
//   return (
//     <div
//       className="photo-grid"
//       style={{
//         gridTemplateColumns: `repeat(${columns}, 1fr)`,
//       }}
//     >
//       {photos.map(photo => (
//         <PhotoItem key={photo.id} photo={photo} onPhotoClick={onPhotoClick} />
//       ))}
//     </div>
//   )
// }
