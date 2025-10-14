// import { useState } from "react";
// import type { Photo } from "../types";
// import { Spinner } from "./spinner";
// import "../css/photo-item.css";

// interface PhotoItemProps {
//   photo: Photo;
//   onPhotoClick: (photo: Photo) => void;
// }

// export const PhotoItem = ({ photo, onPhotoClick }: PhotoItemProps) => {
//   const [isLoading, setIsLoading] = useState(true);

//   return (
//     <div className="photo-item-wrapper" onClick={() => onPhotoClick(photo)}>
//       {isLoading && (
//         <div className="photo-spinner-overlay">
//           <Spinner />
//         </div>
//       )}
//       <img
//         className={`photo-item${isLoading ? " loading" : " loaded"}`}
//         src={photo.src}
//         alt={photo.alt}
//         onLoad={() => setIsLoading(false)}
//       />
//     </div>
//   );
// };
