import { useState, useEffect } from "react";
import type { Canal } from "../types/types";
import { parseMarkdownItems, groupItemsByCategory } from "../utilitats/markdown";
import "./canals.css";

export const Canals = () => {
  const [feeds, setFeeds] = useState<Canal[]>([]);

  useEffect(() => {
    fetch("./canals.md").then((response) =>
      response
        .text()
        .then((markdown) => setFeeds(parseMarkdownItems(markdown)))
    );
  }, []);

  const groupedFeeds = groupItemsByCategory(feeds);

  return (
    <div>
      {Object.entries(groupedFeeds).map(([category, categoryFeeds]) => (
        <div key={category} className="feed-category">
          <h3 className="category-title">{category}</h3>
          <div className="feeds-grid">
            {categoryFeeds.map((feed, index) => (
              <a
                key={`${category}-${index}`}
                href={feed.url}
                target="_blank"
                rel="noopener noreferrer"
                className="feed-item"
              >
                <div>
                  <h4 className="feed-title">
                    {feed.title}
                    <span className="feed-url">
                      {new URL(feed.url).hostname.replace(/^www\./, "")}
                    </span>
                  </h4>
                </div>
                <p className="feed-description">{feed.description}</p>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
