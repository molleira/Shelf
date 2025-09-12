import { useState, useEffect } from "react";
import type { Bookmark } from "../types";
import "../css/bookmark.css";

export const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookmarksFromMarkdown = async () => {
      try {
        const response = await fetch("/bookmarks.md");

        if (!response.ok) {
          throw new Error(
            `Failed to fetch bookmarks.md: ${response.status} ${response.statusText}`
          );
        }

        const markdownText = await response.text();

        if (!markdownText.trim()) {
          setDebugInfo("Markdown file is empty");
          setBookmarks([]);
          return;
        }

        const parsedBookmarks = parseMarkdownBookmarks(markdownText);

        setBookmarks(parsedBookmarks);

        if (parsedBookmarks.length === 0) {
          setDebugInfo("No bookmarks were parsed from the markdown file");
        }
      } catch (err) {
        setError(
          `Failed to load bookmarks: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarksFromMarkdown();
  }, []);

  const parseMarkdownBookmarks = (markdown: string): Bookmark[] => {
    const lines = markdown.split("\n").filter((line) => line.trim());

    const bookmarks: Bookmark[] = [];
    let currentCategory = "Other";

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Check if it's a category header (starts with #)
      if (trimmedLine.startsWith("#")) {
        currentCategory = trimmedLine.replace(/^#+\s*/, "");
        continue;
      }

      // Check if it's a bookmark item (starts with -)
      if (trimmedLine.startsWith("-")) {
        // Simplified regex for better debugging
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)(?:\s*-\s*(.+))?/;
        const linkMatch = trimmedLine.match(linkRegex);

        if (linkMatch) {
          const [, title, url, description] = linkMatch;

          bookmarks.push({
            title: title.trim(),
            url: url.trim(),
            description: description?.trim() || "",
            category: currentCategory,
          });
        } else {
          console.log("Failed to match line as bookmark:", trimmedLine);
        }
      }
    }

    return bookmarks;
  };

  const groupedBookmarks = bookmarks.reduce((acc, bookmark) => {
    const category = bookmark.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(bookmark);
    return acc;
  }, {} as Record<string, Bookmark[]>);

  if (loading) {
    return (
      <div className="bookmarks-container">
        <div className="loading">Loading bookmarks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bookmarks-container">
        <div className="error">
          <p>{error}</p>
          <p className="error-hint">
            Make sure bookmarks.md exists in the public folder
          </p>
        </div>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="bookmarks-container">
        <div className="empty">
          <p>No bookmarks found</p>
          {debugInfo && <p className="debug-info">{debugInfo}</p>}
          <p className="empty-hint">
            Make sure your bookmarks.md file is formatted correctly:
          </p>
          <pre className="format-example">
            # Category Name
            <br />- [Website Name](https://example.com) - Description
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="bookmarks-container">
      {Object.entries(groupedBookmarks).map(([category, categoryBookmarks]) => (
        <div key={category} className="bookmark-category">
          <h3 className="category-title">{category}</h3>
          <div className="bookmarks-grid">
            {categoryBookmarks.map((bookmark, index) => (
              <a
                key={`${category}-${index}`}
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bookmark-item"
              >
                <h4 className="bookmark-title">{bookmark.title}</h4>
                {bookmark.description && (
                  <p className="bookmark-description">{bookmark.description}</p>
                )}
                <span className="bookmark-url">
                  {new URL(bookmark.url).hostname.replace("www.", "")}
                </span>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
