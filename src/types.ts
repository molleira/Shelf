export interface Photo {
  id: number;
  src: string;
  alt: string;
  date: string;
  location: string;
  description: string;
  protected?: boolean;
}

export interface Bookmark {
  title: string;
  url: string;
  description?: string;
  category?: string;
}

export interface WantlistRecord {
  id: string;
  artist: string;
  title: string;
  year: string;
  label: string;
  catalogNumber: string;
  format: string;
  country: string;
  discogsUrl: string;
  imageUrl: string;
  priceRange: string;
  condition: string;
  notes: string;
  priority: "high" | "medium" | "low";
  dateAdded: string;
}
