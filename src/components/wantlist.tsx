import { useEffect, useState } from "react"
import type { WantlistRecord } from "../types"
import "./Wantlist.css"

interface WantlistData {
  records: WantlistRecord[]
}

interface WantlistProps {
  columns?: number
}

// Add this fallback data at the top of the component, after the interface definition
const fallbackRecords: WantlistRecord[] = [
  {
    id: "1",
    artist: "Pink Floyd",
    title: "The Dark Side of the Moon",
    year: "1973",
    label: "Harvest",
    catalogNumber: "SHVL 804",
    format: "Vinyl, LP, Album",
    country: "UK",
    discogsUrl: "https://www.discogs.com/release/1018060-Pink-Floyd-The-Dark-Side-Of-The-Moon",
    imageUrl: "/placeholder.svg?height=300&width=300",
    priceRange: "$80 - $150",
    condition: "VG+ or better",
    notes: "Original UK pressing preferred",
    priority: "high",
    dateAdded: "2024-01-15",
  },
  {
    id: "2",
    artist: "Miles Davis",
    title: "Kind of Blue",
    year: "1959",
    label: "Columbia",
    catalogNumber: "CL 1355",
    format: "Vinyl, LP, Album, Mono",
    country: "US",
    discogsUrl: "https://www.discogs.com/release/1234567-Miles-Davis-Kind-Of-Blue",
    imageUrl: "/placeholder.svg?height=300&width=300",
    priceRange: "$200 - $400",
    condition: "VG+ or better",
    notes: "Original mono pressing, 6-eye label",
    priority: "high",
    dateAdded: "2024-01-10",
  },
  {
    id: "3",
    artist: "The Beatles",
    title: "Abbey Road",
    year: "1969",
    label: "Apple Records",
    catalogNumber: "PCS 7088",
    format: "Vinyl, LP, Album, Stereo",
    country: "UK",
    discogsUrl: "https://www.discogs.com/release/1234568-The-Beatles-Abbey-Road",
    imageUrl: "/placeholder.svg?height=300&width=300",
    priceRange: "$60 - $120",
    condition: "VG+ or better",
    notes: "Original UK pressing with Her Majesty at the end",
    priority: "medium",
    dateAdded: "2024-01-08",
  },
]

export const Wantlist = ({ columns = 3 }: WantlistProps) => {
  const [records, setRecords] = useState<WantlistRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"dateAdded" | "artist" | "priority">("dateAdded")
  const [filterPriority, setFilterPriority] = useState<"all" | "high" | "medium" | "low">("all")

  useEffect(() => {
    const fetchWantlist = async () => {
      try {
        console.log("Fetching wantlist.json...")
        const response = await fetch("/wantlist.json")

        if (!response.ok) {
          throw new Error(`Failed to fetch wantlist.json: ${response.status} ${response.statusText}`)
        }

        const text = await response.text()
        console.log("Raw response:", text.substring(0, 100) + "...")

        if (!text.trim()) {
          throw new Error("Empty response received")
        }

        try {
          const data: WantlistData = JSON.parse(text)
          setRecords(data.records)
        } catch (parseError) {
          console.error("JSON parse error:", parseError)
          throw new Error(`Invalid JSON: ${parseError instanceof Error ? parseError.message : String(parseError)}`)
        }
      } catch (err) {
        console.error("Error fetching wantlist:", err)
        setError(`Failed to load wantlist: ${err instanceof Error ? err.message : String(err)}`)

        // Fallback to hardcoded data
        console.log("Using fallback data")
        setRecords(fallbackRecords)
      } finally {
        setLoading(false)
      }
    }

    fetchWantlist()
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#d73a49"
      case "medium":
        return "#fb8500"
      case "low":
        return "#28a745"
      default:
        return "#666"
    }
  }

  const sortedAndFilteredRecords = records
    .filter((record) => filterPriority === "all" || record.priority === filterPriority)
    .sort((a, b) => {
      switch (sortBy) {
        case "artist":
          return a.artist.localeCompare(b.artist)
        case "priority":
          {
            const priorityOrder = { high: 3, medium: 2, low: 1 }
            return priorityOrder[b.priority] - priorityOrder[a.priority]
          }
        case "dateAdded":
        default:
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      }
    })

  if (loading) {
    return (
      <div className="wantlist-container">
        <div className="loading">Loading wantlist...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="wantlist-container">
        <div className="error">
          <p>{error}</p>
          <p className="error-hint">Make sure wantlist.json exists in the public folder</p>
        </div>
      </div>
    )
  }

  if (records.length === 0) {
    return (
      <div className="wantlist-container">
        <div className="empty">
          <p>No records in wantlist</p>
          <p className="empty-hint">Add some records to your wantlist.json file</p>
        </div>
      </div>
    )
  }

  return (
    <div className="wantlist-container">
      <div className="wantlist-header">
        <div className="wantlist-controls">
          <div className="control-group">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="control-select"
            >
              <option value="dateAdded">Date Added</option>
              <option value="artist">Artist</option>
              <option value="priority">Priority</option>
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="priority-filter">Priority:</label>
            <select
              id="priority-filter"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as typeof filterPriority)}
              className="control-select"
            >
              <option value="all">All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div className="wantlist-stats">
          <span className="record-count">{sortedAndFilteredRecords.length} records</span>
        </div>
      </div>

      <div
        className="records-grid"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
      >
        {sortedAndFilteredRecords.map((record) => (
          <div key={record.id} className="record-item">
            <div className="record-image">
              <img src={record.imageUrl || "/placeholder.svg"} alt={`${record.artist} - ${record.title}`} />
              <div className="priority-badge" style={{ backgroundColor: getPriorityColor(record.priority) }}>
                {record.priority}
              </div>
            </div>

            <div className="record-info">
              <h3 className="record-title">{record.title}</h3>
              <p className="record-artist">{record.artist}</p>
              <p className="record-details">
                {record.year} • {record.label} • {record.catalogNumber}
              </p>
              <p className="record-format">{record.format}</p>
              <p className="record-price">{record.priceRange}</p>

              {record.notes && <p className="record-notes">{record.notes}</p>}

              <div className="record-actions">
                <a href={record.discogsUrl} target="_blank" rel="noopener noreferrer" className="discogs-link">
                  View on Discogs →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
