import type { Photo } from "./types";

// Sample photo data with protection flags
export const photos: Photo[] = [
  {
    id: 1,
    src: "https://picsum.photos/800/600?random=1",
    alt: "Mountain landscape",
    date: "April 15, 2023",
    location: "Yosemite National Park, CA",
    description: "Spring morning at Yosemite Valley",
    protected: false,
  },
  {
    id: 2,
    src: "https://picsum.photos/800/600?random=2",
    alt: "Ocean sunset",
    date: "June 22, 2023",
    location: "Big Sur, CA",
    description: "Sunset over the Pacific",
    protected: true,
  },
  {
    id: 3,
    src: "https://picsum.photos/800/600?random=3",
    alt: "Desert landscape",
    date: "March 10, 2023",
    location: "Joshua Tree, CA",
    description: "Desert flora in bloom",
    protected: false,
  },
  {
    id: 4,
    src: "https://picsum.photos/800/600?random=4",
    alt: "City skyline",
    date: "July 4, 2023",
    location: "San Francisco, CA",
    description: "City lights at dusk",
    protected: true,
  },
  {
    id: 5,
    src: "https://picsum.photos/800/600?random=5",
    alt: "Forest path",
    date: "September 18, 2023",
    location: "Redwood National Park, CA",
    description: "Morning fog in the redwoods",
    protected: false,
  },
  {
    id: 6,
    src: "https://picsum.photos/800/600?random=6",
    alt: "Lake view",
    date: "August 5, 2023",
    location: "Lake Tahoe, CA",
    description: "Crystal clear waters",
    protected: false,
  },
]