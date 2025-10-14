import { useState, useEffect } from "react";
import type { Bookmark } from "../types";
import { parseMarkdownItems, groupItemsByCategory } from "../helpers/markdown";
import "./bookmark.css";

export const BookmarkPage = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    fetch("./bookmarks.md").then((response) =>
      response
        .text()
        .then((markdown) => setBookmarks(parseMarkdownItems(markdown)))
    );
  }, []);

  const groupedBookmarks = groupItemsByCategory(bookmarks);

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
