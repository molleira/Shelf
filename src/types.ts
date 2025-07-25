export interface Photo {
  id: number
  src: string
  alt: string
  date: string
  location: string
  description: string
  protected?: boolean
}

export interface Bookmark {
  title: string
  url: string
  description?: string
  category?: string
}