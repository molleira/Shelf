import { useState, useEffect } from "react";
import type { Bookmark } from "../types";
import "./bookmark.css";

export const BookmarkPage = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    fetch("/bookmarks.md").then((response) =>
      response
        .text()
        .then((markdown) => setBookmarks(parseMarkdownBookmarks(markdown)))
    );
  }, []);

  const parseMarkdownBookmarks = (markdown: string): Bookmark[] => {
    const bookmarks: Bookmark[] = [];
    let currentCategory = "Other";

    markdown
      .split("\n")
      .map((line) => line.trim())
      .forEach((line) => {
        if (line.startsWith("#")) {
          currentCategory = line.replace(/^#+\s*/, "");
        } else if (line.startsWith("- [")) {
          const match = line.match(/\[([^\]]+)\]\(([^)]+)\)(?:\s*-\s*(.+))?/);
          if (match) {
            const [, title, url, description] = match;
            bookmarks.push({
              title: title.trim(),
              url: url.trim(),
              description: description?.trim() || "",
              category: currentCategory,
            });
          }
        }
      });

    return bookmarks;
  };

  const groupBookmarksByCategory = (bookmarks: Bookmark[]) => {
    return bookmarks.reduce((acc, bookmark) => {
      const category = bookmark.category || "Other";
      acc[category] ??= [];
      acc[category].push(bookmark);
      return acc;
    }, {} as Record<string, Bookmark[]>);
  };
  const groupedBookmarks = groupBookmarksByCategory(bookmarks);

  return (
    <div>
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
                <div>
                  <h4 className="bookmark-title">
                    {bookmark.title}
                    <span className="bookmark-url">
                      {new URL(bookmark.url).hostname.replace(/^www\./, "")}
                    </span>
                  </h4>
                </div>
                <p className="bookmark-description">{bookmark.description}</p>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
