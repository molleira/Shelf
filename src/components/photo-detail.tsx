// import { useEffect } from "react"
// import type { Photo } from "../types"
// import '../css/photo-detail.css'
// interface PhotoDetailProps {
//   photo: Photo
//   onClose: () => void
// }

// export const PhotoDetail = ({ photo, onClose }: PhotoDetailProps) => {
//   // Prevent scrolling of the background when detail view is open
//   useEffect(() => {
//     document.body.style.overflow = "hidden"
//     return () => {
//       document.body.style.overflow = ""
//     }
//   }, [])

//   return (
//     <div className="photo-detail-overlay" onClick={onClose}>
//       <div className="photo-detail" onClick={(e) => e.stopPropagation()}>
//         <button className="close-button" onClick={onClose} aria-label="Close">
//           ×
//         </button>
//         <div className="photo-container">
//           <img src={photo.src || "/placeholder.svg"} alt={photo.alt} />
//         </div>
//         <div className="photo-info">
//           <p className="photo-description">{photo.description}</p>
//           <div className="photo-metadata">
//             <p className="photo-date">{photo.date}</p>
//             <p className="photo-location">{photo.location}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
